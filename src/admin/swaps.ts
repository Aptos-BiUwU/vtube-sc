import { aptos, getAccountFromPrivateKey, submitTx } from "../utils";
import { adminAccount, adminAddress } from "./init";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { adminRouter, mintBiUwU, mintCoin } from "./index";
import { SDK } from "@pontem/liquidswap-sdk";

const sdk = new SDK({
  nodeUrl: "https://fullnode.devnet.aptoslabs.com/v1",
});

async function createPool(
  coinPrivateKey: string,
  amountBiUwU: number,
  amountCoin: number,
) {
  const coinAccount = getAccountFromPrivateKey(coinPrivateKey);
  const coinAddress = coinAccount.accountAddress.toString();

  await mintBiUwU(coinAddress, amountBiUwU);
  await mintCoin(coinPrivateKey, coinAddress, amountCoin);

  const txData = await sdk.Liquidity.createAddLiquidityPayload({
    fromToken: `${adminAddress}::biuwu_coin::biuwu`,
    toToken: `${coinAddress}::vtuber_coin::VtuberCoin`,
    fromAmount: amountBiUwU,
    toAmount: amountCoin,
    interactiveToken: "from",
    slippage: 0.005,
    curveType: "uncorrelated",
    version: 0,
  });
  console.log(txData);
}
