import { aptos } from "../utils";
import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { transactionsRouter } from "./index";
import { InputEntryFunctionData } from "@aptos-labs/ts-sdk";

function getRegisterCoinTxData(coinAddress: string) {
  return {
    function: `0x1::managed_coin::register`,
    functionArguments: [],
    typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
  };
}

export async function getRegisterCoinTx(
  userAddress: string,
  coinAddress: string,
) {
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    data: getRegisterCoinTxData(coinAddress) as InputEntryFunctionData,
  });
  return tx;
}

transactionsRouter.post(
  "/getRegisterCoinTxData",
  async (req: Request, res: Response) => {
    const { coinAddress } = req.body;
    if (coinAddress == undefined) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const txData = getRegisterCoinTxData(coinAddress);
      return res.status(StatusCodes.OK).send({ txData });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);

function getRegisterBiUwUTxData() {
  return {
    function: `0x1::managed_coin::register`,
    functionArguments: [],
    typeArguments: [`${adminAddress}::biuwu_coin::BiUwU`],
  };
}

export async function getRegisterBiUwUTx(userAddress: string) {
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    data: getRegisterBiUwUTxData() as InputEntryFunctionData,
  });
  return tx;
}

transactionsRouter.post(
  "/getRegisterBiUwUTxData",
  async (_req: Request, res: Response) => {
    try {
      const txData = getRegisterBiUwUTxData();
      return res.status(StatusCodes.OK).send({ txData });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);

function getTransferCoinTxData(
  coinAddress: string,
  receiverAddress: string,
  amount: number,
) {
  return {
    function: `0x1::coin::transfer`,
    functionArguments: [receiverAddress, amount],
    typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
  };
}

export async function getTransferCoinTx(
  senderAddress: string,
  coinAddress: string,
  receiverAddress: string,
  amount: number,
) {
  const tx = await aptos.transaction.build.simple({
    sender: senderAddress,
    data: getTransferCoinTxData(
      coinAddress,
      receiverAddress,
      amount,
    ) as InputEntryFunctionData,
  });
  return tx;
}

transactionsRouter.post(
  "/getTransferCoinTxData",
  async (req: Request, res: Response) => {
    const { coinAddress, receiverAddress, amount } = req.body;
    if (
      coinAddress == undefined ||
      receiverAddress == undefined ||
      amount == undefined
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const txData = getTransferCoinTxData(
        coinAddress,
        receiverAddress,
        amount,
      );
      return res.status(StatusCodes.OK).send({ txData });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);
