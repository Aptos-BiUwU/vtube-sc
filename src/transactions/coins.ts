import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { transactionsRouter } from "./index";

export function getRegisterCoinTxData(coinAddress: string) {
  return {
    function: `0x1::managed_coin::register`,
    functionArguments: [],
    typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
  };
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

export function getRegisterBiUwUTxData() {
  return {
    function: `0x1::managed_coin::register`,
    functionArguments: [],
    typeArguments: [`${adminAddress}::biuwu_coin::BiUwU`],
  };
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
