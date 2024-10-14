import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { transactionsRouter } from "./index";

function getDepositTxData(coinAddress: string, amount: number) {
  return {
    function: `${adminAddress}::scripts::deposit`,
    functionArguments: [amount],
    typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
  };
}

transactionsRouter.post(
  "/getDepositTxData",
  async (req: Request, res: Response) => {
    const { coinAddress, amount } = req.body;
    if (coinAddress == undefined || amount == undefined) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const txData = getDepositTxData(coinAddress, amount);
      return res.status(StatusCodes.OK).send({ txData });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);

function getUpdateTierTxData(coinAddress: string, tier: number) {
  return {
    function: `${adminAddress}::scripts::update_tier`,
    functionArguments: [tier],
    typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
  };
}

transactionsRouter.post(
  "/getUpdateTierTxData",
  async (req: Request, res: Response) => {
    const { coinAddress, tier } = req.body;
    if (coinAddress == undefined || tier == undefined) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const txData = getUpdateTierTxData(coinAddress, tier);
      return res.status(StatusCodes.OK).send({ txData });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);
