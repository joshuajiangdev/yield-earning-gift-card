use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use cw_storage_plus::Item;

use cosmwasm_bignumber::Uint256;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct GiftDetail {
    pub receiver: Addr,
    pub sender: Addr,
    pub amount: Uint256,
    pub msg: String,
    pub is_claimed: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub giftcards: Vec<GiftDetail>,
    pub owner: Addr,
}

pub const STATE: Item<State> = Item::new("state");
