import { MsgExecuteContract, Fee, Coins } from "@terra-money/terra.js";
import { ConnectedWallet } from "@terra-money/wallet-provider";
import { contractAdress } from "./address";

import { lcd } from "./lcdClient";

// ==== utils ====

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const until = Date.now() + 1000 * 60 * 60;
const untilInterval = Date.now() + 1000 * 60;

const _exec =
  (msg: any, coins?: Coins.Input, fee = new Fee(1000000, { uusd: 200000 })) =>
  async (wallet?: ConnectedWallet) => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }

    const { result } = await wallet.post({
      fee,
      msgs: [
        new MsgExecuteContract(
          wallet.walletAddress,
          contractAdress(wallet),
          msg,
          coins
        ),
      ],
    });

    while (true) {
      try {
        return await lcd.tx.txInfo(result.txhash);
      } catch (e) {
        if (Date.now() < untilInterval) {
          await sleep(500);
        } else if (Date.now() < until) {
          await sleep(1000 * 10);
        } else {
          throw new Error(
            `Transaction queued. To verify the status, please check the transaction hash: ${result.txhash}`
          );
        }
      }
    }
  };

// ==== execute contract ====

interface SendGiftProps {
  amount: string;
  receiver: string;
  gift_msg: string;
}

export const sendGift = (props: SendGiftProps) =>
  _exec({ send_gift: props }, { uusd: props.amount + "000000" });

interface ClaimGiftProps {
  gift_id: number;
}
export const claimGift = (props: ClaimGiftProps) =>
  _exec({ claim_gift: props });
