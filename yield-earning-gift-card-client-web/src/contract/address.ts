import { ConnectedWallet } from "@terra-money/wallet-provider";
import config from "../../refs.terrain.json";
export const contractAdress = (wallet: ConnectedWallet) =>
  config[wallet.network.name].counter.contractAddresses.default;
