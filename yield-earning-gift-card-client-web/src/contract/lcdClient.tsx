import { Coins, LCDClient } from "@terra-money/terra.js";

// Fetch gas prices and convert to `Coin` format.
const gasPrices = await (
  await fetch("https://bombay-fcd.terra.dev/v1/txs/gas_prices")
).json();
const gasPricesCoins = new Coins(gasPrices);

export const lcd = new LCDClient({
  URL: "https://bombay-lcd.terra.dev/",
  chainID: "bombay-12",
  gasPrices: gasPricesCoins,
  gasAdjustment: "1.5",
});
