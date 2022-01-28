import { ConnectedWallet } from "@terra-money/wallet-provider";
import {} from "@terra-money/terra.js";
import { contractAdress } from "./address";
import { lcd } from "./lcdClient";

export interface GiftDetail {
  gift_id: number;
  amount: string;
  msg: string;
  receiver: string;
  sender: string
}

export const getGiftDetail = async (
  giftId: number,
  wallet?: ConnectedWallet
): Promise<GiftDetail> => {
  if (!wallet) {
    throw new Error("No wallet connected");
  }

  return lcd.wasm.contractQuery(contractAdress(wallet), {
    get_gift_detail: {
      gift_id: giftId,
    },
  });
};
