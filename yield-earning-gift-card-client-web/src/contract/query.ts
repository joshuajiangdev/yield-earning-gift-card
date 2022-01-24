import { ConnectedWallet } from "@terra-money/wallet-provider";
import { contractAdress } from "./address";
import { lcd } from "./lcdClient";

export const getCount = async (
  wallet?: ConnectedWallet
): Promise<{ count: number }> => {
  if (!wallet) {
    throw new Error("No wallet connected");
  }

  return lcd.wasm.contractQuery(contractAdress(wallet), { get_count: {} });
};


export const getGreeting = async (
  wallet?: ConnectedWallet
): Promise<{ count: number }> => {
  if (!wallet) {
    throw new Error("No wallet connected");
  }

  return lcd.wasm.contractQuery(contractAdress(wallet), { get_greeting: {} });
};