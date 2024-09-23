import { aptos } from "../utils";
import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { transactionsRouter, stringify } from "./index";

export async function getDonateTx(
  userAddress: string,
  vaultId: number,
  side: boolean,
  amount: number,
) {
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    data: {
      function: `${adminAddress}::scripts::donate`,
      functionArguments: [vaultId, side, amount],
    },
  });
  return tx;
}

transactionsRouter.post("/getDonateTx", async (req: Request, res: Response) => {
  const { userAddress, vaultId, side, amount } = req.body;
  if (
    userAddress == undefined ||
    vaultId == undefined ||
    side == undefined ||
    amount == undefined
  ) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  try {
    const tx = await getDonateTx(userAddress, vaultId, side, amount);
    return res.status(StatusCodes.OK).send({ stringifiedTx: stringify(tx) });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});
