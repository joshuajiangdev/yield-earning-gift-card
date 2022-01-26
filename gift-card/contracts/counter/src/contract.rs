#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cosmwasm_std::{Addr, StdError};
use cw2::set_contract_version;

use crate::anchor;
use crate::config;
use crate::error::ContractError;
use crate::msg::{
    ExecuteMsg, GetGiftDetailResponse, GreetingResponse, InstantiateMsg, MigrateMsg, QueryMsg,
};

use crate::state::{GiftDetail, State, STATE};
use cosmwasm_bignumber::Uint256;
use std::convert::TryFrom;

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
        ExecuteMsg::Deposit { amount } => try_deposit(deps, info, amount),
        ExecuteMsg::SendGift {
            receiver,
            amount,
            gift_msg,
        } => try_send_gift(deps, info.sender, receiver, amount, gift_msg),
    }
}

pub fn try_send_gift(
    deps: DepsMut,
    sender: Addr,
    receiver: Addr,
    amount: Uint256,
    msg: String,
) -> Result<Response, ContractError> {
    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        let gift_card = GiftDetail {
            sender: sender,
            receiver: receiver,
            amount: amount,
            msg: msg,
            // created_at: current_time.clone(),
            // claimed_at: Option::None,
        };

        state.giftcards.push(gift_card);

        Ok(state)
    })?;

    Ok(Response::new()
        .add_attribute("method", "try_send_gift")
        .add_attribute(
            "gift_id",
            (STATE.load(deps.storage)?.giftcards.len() - 1).to_string(),
        ))
}

pub fn try_deposit(
    deps: DepsMut,
    info: MessageInfo,
    amount: i32,
) -> Result<Response, ContractError> {
    // deposit funds into anchor for a given wallet
    let config = config::read(deps.storage).unwrap();

    // check deposit
    let received: Uint256 = info
        .funds
        .iter()
        .find(|c| c.denom == config.stable_denom)
        .map(|c| Uint256::from(c.amount))
        .unwrap_or_else(Uint256::zero);

    let market_address = "terra15dwd5mj8v59wpj0wvt233mf5efdff808c5tkal";
    // NOTE: you can add any key/value pairs to the response as a way of logging
    // print something out first - the amount to be deposited and the sender
    Ok(Response::new()
        .add_messages(anchor::deposit_stable_msg(
            deps.as_ref(),
            &deps.api.addr_canonicalize(market_address).unwrap(),
            "uusd",
            received.into(),
        )?)
        .add_attribute("method", "try_deposit")
        .add_attribute("owner", info.sender) // owner is the address of the sender
        .add_attribute("amount", amount.to_string()))
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

fn query_greeting() -> StdResult<GreetingResponse> {
    Ok(GreetingResponse {
        greeting: String::from("hello miami"),
    })
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
            amount: Uint256::from(amount),
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
