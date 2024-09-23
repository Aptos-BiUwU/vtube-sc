import { aptos } from "../utils";
import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { transactionsRouter, stringify } from "./index";

export async function getDepositTx(
  userAddress: string,
  coinAddress: string,
  amount: number,
) {
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    data: {
      function: `${adminAddress}::scripts::deposit`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [amount],
    },
  });
  return tx;
}

transactionsRouter.post(
  "/getDepositTx",
  async (req: Request, res: Response) => {
    const { userAddress, coinAddress, amount } = req.body;
    if (
      userAddress == undefined ||
      coinAddress == undefined ||
      amount == undefined
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const tx = await getDepositTx(userAddress, coinAddress, amount);
      return res.status(StatusCodes.OK).send({ stringifiedTx: stringify(tx) });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);

export async function getUpdateTierTx(
  userAddress: string,
  coinAddress: string,
  tier: number,
) {
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    data: {
      function: `${adminAddress}::scripts::update_tier`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [tier],
    },
  });
  return tx;
}

transactionsRouter.post(
  "/getUpdateTierTx",
  async (req: Request, res: Response) => {
    const { userAddress, coinAddress, tier } = req.body;
    if (
      userAddress == undefined ||
      coinAddress == undefined ||
      tier == undefined
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const tx = await getUpdateTierTx(userAddress, coinAddress, tier);
      return res.status(StatusCodes.OK).send({ stringifiedTx: stringify(tx) });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);
