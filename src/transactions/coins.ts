import { aptos } from "../utils";
import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { transactionsRouter, stringify } from "./index";

export async function getRegisterCoinTx(
  userAddress: string,
  coinAddress: string,
) {
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    data: {
      function: `0x1::managed_coin::register`,
      functionArguments: [],
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
    },
  });
  return tx;
}

transactionsRouter.post(
  "/getRegisterCoinTx",
  async (req: Request, res: Response) => {
    const { userAddress, coinAddress } = req.body;
    if (userAddress == undefined || coinAddress == undefined) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const tx = await getRegisterCoinTx(userAddress, coinAddress);
      return res.status(StatusCodes.OK).send({ stringifiedTx: stringify(tx) });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);

export async function getRegisterBiUwUTx(userAddress: string) {
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    data: {
      function: `0x1::managed_coin::register`,
      functionArguments: [],
      typeArguments: [`${adminAddress}::biuwu_coin::BiUwU`],
    },
  });
  return tx;
}

transactionsRouter.post(
  "/getRegisterBiUwUTx",
  async (req: Request, res: Response) => {
    const { userAddress } = req.body;
    if (userAddress == undefined) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const tx = await getRegisterBiUwUTx(userAddress);
      return res.status(StatusCodes.OK).send({ stringifiedTx: stringify(tx) });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);

export async function getTransferCoinTx(
  coinAddress: string,
  senderAddress: string,
  receiverAddress: string,
  amount: number,
) {
  const tx = await aptos.transaction.build.simple({
    sender: senderAddress,
    data: {
      function: `0x1::coin::transfer`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [receiverAddress, amount],
    },
  });
  return tx;
}

transactionsRouter.post(
  "/getTransferCoinTx",
  async (req: Request, res: Response) => {
    const { coinAddress, senderAddress, receiverAddress, amount } = req.body;
    if (
      coinAddress == undefined ||
      senderAddress == undefined ||
      receiverAddress == undefined ||
      amount == undefined
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const tx = await getTransferCoinTx(
        coinAddress,
        senderAddress,
        receiverAddress,
        amount,
      );
      return res.status(StatusCodes.OK).send({ stringifiedTx: stringify(tx) });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);
