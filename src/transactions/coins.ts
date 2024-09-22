import { aptos } from "../utils";
import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { transactionsRouter } from "./index";

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
    if (!userAddress || !coinAddress) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    const tx = await getRegisterCoinTx(userAddress, coinAddress);
    return res.status(StatusCodes.OK).send({ tx });
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
    if (!userAddress) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    const tx = await getRegisterBiUwUTx(userAddress);
    return res.status(StatusCodes.OK).send({ tx });
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
    if (!coinAddress || !senderAddress || !receiverAddress || !amount) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    const tx = await getTransferCoinTx(
      coinAddress,
      senderAddress,
      receiverAddress,
      amount,
    );
    return res.status(StatusCodes.OK).send({ tx });
  },
);
