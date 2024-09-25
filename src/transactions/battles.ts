import { aptos } from "../utils";
import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { transactionsRouter } from "./index";
import { InputEntryFunctionData } from "@aptos-labs/ts-sdk";

function getDonateBattleTxData(vaultId: number, side: boolean, amount: number) {
  return {
    function: `${adminAddress}::scripts::donate`,
    functionArguments: [vaultId, side, amount],
  };
}

export async function getDonateBattleTx(
  userAddress: string,
  vaultId: number,
  side: boolean,
  amount: number,
) {
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    data: getDonateBattleTxData(
      vaultId,
      side,
      amount,
    ) as InputEntryFunctionData,
  });
  return tx;
}

transactionsRouter.post(
  "/getDonateBattleTxData",
  async (req: Request, res: Response) => {
    const { vaultId, side, amount } = req.body;
    if (vaultId == undefined || side == undefined || amount == undefined) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const txData = getDonateBattleTxData(vaultId, side, amount);
      return res.status(StatusCodes.OK).send({ txData });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);
