#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, BankMsg, Binary, Coin, CosmosMsg, Deps, DepsMut, Env, MessageInfo, Response,
    StdResult,
};
use cosmwasm_std::{Addr, StdError};
use cw2::set_contract_version;

use crate::anchor;
use crate::config;
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, GetGiftDetailResponse, InstantiateMsg, MigrateMsg, QueryMsg};

use crate::state::{GiftDetail, State, STATE};
use cosmwasm_bignumber::Uint256;
use std::convert::TryFrom;
use std::ops::Div;

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:counter";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(_deps: DepsMut, _env: Env, _msg: MigrateMsg) -> StdResult<Response> {
    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = State {
        owner: info.sender.clone(),
        giftcards: vec![],
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    STATE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::SendGift { receiver, gift_msg } => {
            try_send_gift(deps, info, receiver, gift_msg)
        }
        ExecuteMsg::ClaimGift { gift_id } => try_claim_gift(deps, info.sender, gift_id),
    }
}

pub fn try_claim_gift(
    deps: DepsMut,
    claimer: Addr,
    gift_id: u32,
) -> Result<Response, ContractError> {
    let mut amount = Uint256::zero();
    let result = STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        let gift_detail = state.giftcards.get_mut(usize::try_from(gift_id).unwrap());

        if let Some(gift_detail) = gift_detail {
            if !gift_detail.receiver.eq(&claimer) {
                return Err(ContractError::Std(StdError::generic_err(
                    "Only receiver could claim the gift",
                )));
            }

            if gift_detail.is_claimed {
                return Err(ContractError::Std(StdError::generic_err(
                    "Gift is already claimed",
                )));
            }
            amount = gift_detail.amount;
            gift_detail.is_claimed = true;

            Ok(state)
        } else {
            return Err(ContractError::Std(StdError::generic_err(
                "Only receiver could claim the gift",
            )));
        }
    });
    let anchor_market_address_str = "terra15dwd5mj8v59wpj0wvt233mf5efdff808c5tkal";
    let anchor_market_address = deps
        .api
        .addr_canonicalize(anchor_market_address_str)
        .unwrap();
    let epoch_state = anchor::epoch_state(deps.as_ref(), &anchor_market_address)?;
    let market_redeem_amount = Uint256::from(amount).div(epoch_state.exchange_rate);
    let anchor_ust_address = "terra1ajt556dpzvjwl0kl5tzku3fc3p3knkg9mkv8jl";
    match result {
        Ok(state) => {
            let gift_detail = state.giftcards.get(usize::try_from(gift_id).unwrap());

            if let Some(gift_detail) = gift_detail {
                // withdraw from anchor and send from our contract to user

                return Ok(Response::new()
                    .add_messages(anchor::redeem_stable_msg(
                        deps.as_ref(),
                        &anchor_market_address,
                        &deps.api.addr_canonicalize(anchor_ust_address).unwrap(),
                        market_redeem_amount.into(),
                    )?)
                    .add_message(CosmosMsg::Bank(BankMsg::Send {
                        to_address: claimer.to_string(),
                        amount: vec![Coin {
                            denom: "uusd".to_string(),
                            amount: amount.into(),
                        }],
                    }))
                    .add_attribute("action", "redeem")
                    .add_attribute("claimer", claimer)
                    .add_attribute("amount", amount.to_string())
                    .add_attribute("market_redeem_amount", market_redeem_amount));
            } else {
                return Err(ContractError::Std(StdError::generic_err(
                    "Cannot find detail",
                )));
            }
        }
        Err(err) => return Err(err),
    }
}

pub fn try_send_gift(
    deps: DepsMut,
    info: MessageInfo,
    receiver: Addr,
    msg: String,
) -> Result<Response, ContractError> {
    let sender = info.sender;

    // extract deposited funds
    let amount: Uint256 = info
        .funds
        .iter()
        .find(|c| c.denom == "uusd")
        .map(|c| Uint256::from(c.amount))
        .unwrap_or_else(Uint256::zero);

    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        let gift_card = GiftDetail {
            receiver,
            sender,
            amount,
            msg,
            is_claimed: false,
        };

        state.giftcards.push(gift_card);

        Ok(state)
    })?;

    let anchor_market_address = "terra15dwd5mj8v59wpj0wvt233mf5efdff808c5tkal";

    Ok(Response::new()
        .add_attribute("method", "try_send_gift")
        .add_attribute(
            "gift_id",
            (STATE.load(deps.storage)?.giftcards.len() - 1).to_string(),
        )
        .add_attribute("funds_received", amount)
        .add_messages(anchor::deposit_stable_msg(
            deps.as_ref(),
            &deps.api.addr_canonicalize(anchor_market_address).unwrap(),
            &"uusd",
            amount.into(),
        )?))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetGiftDetail { gift_id } => to_binary(&query_gift_detail(deps, gift_id)?),
    }
}

fn query_gift_detail(deps: Deps, gift_id: u32) -> StdResult<GetGiftDetailResponse> {
    let state = STATE.load(deps.storage)?;
    let gift_detail = state.giftcards.get(usize::try_from(gift_id).unwrap());

    match gift_detail {
        Option::None => Err(StdError::GenericErr {
            msg: "Invalid gift".to_string(),
        }),
        Some(GiftDetail {
            receiver,
            amount,
            msg,
            ..
        }) => Ok(GetGiftDetailResponse {
            gift_id: gift_id,
            receiver: receiver.clone(),
            amount: amount.clone(),
            msg: msg.clone(),
        }),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_binary};

    #[test]
    fn create_and_read() {
        let mut deps = mock_dependencies(&coins(2, "token"));

        let msg = InstantiateMsg {};
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();

        let receiver = "receiver";
        let amount: u128 = 100;
        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::SendGift {
            receiver: Addr::unchecked(receiver),
            gift_msg: "some message".to_string(),
        };
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        let optional_gift_id_attribute = _res.attributes.get(1);

        if let Some(gift_id_attribute) = optional_gift_id_attribute {
            let res = query(
                deps.as_ref(),
                mock_env(),
                QueryMsg::GetGiftDetail {
                    gift_id: gift_id_attribute.value.parse::<u32>().unwrap(),
                },
            )
            .unwrap();
            let value: GetGiftDetailResponse = from_binary(&res).unwrap();
            assert_eq!(receiver, value.receiver);
            assert_eq!(Uint256::from(amount), value.amount);
        }
    }
}
