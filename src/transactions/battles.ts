import { aptos } from "../utils";
import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { transactionsRouter } from "./index";
import { InputEntryFunctionData } from "@aptos-labs/ts-sdk";

function getDonateTxData(vaultId: number, side: boolean, amount: number) {
  return {
    function: `${adminAddress}::scripts::donate`,
    functionArguments: [vaultId, side, amount],
  };
}

export async function getDonateTx(
  userAddress: string,
  vaultId: number,
  side: boolean,
  amount: number,
) {
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    data: getDonateTxData(vaultId, side, amount) as InputEntryFunctionData,
  });
  return tx;
}

transactionsRouter.post(
  "/getDonateTxData",
  async (req: Request, res: Response) => {
    const { vaultId, side, amount } = req.body;
    if (vaultId == undefined || side == undefined || amount == undefined) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const txData = getDonateTxData(vaultId, side, amount);
      return res.status(StatusCodes.OK).send({ txData });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);
