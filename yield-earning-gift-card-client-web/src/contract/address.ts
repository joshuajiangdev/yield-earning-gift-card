import { ConnectedWallet } from "@terra-money/wallet-provider";
import config from "../../refs.terrain.json";
export const contractAdress = (wallet: ConnectedWallet) =>
  config.testnet.counter.contractAddresses.default;
