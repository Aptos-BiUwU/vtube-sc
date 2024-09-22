import { aptos } from "../utils";
import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { transactionsRouter } from "./index";

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
  if (!userAddress || !vaultId || !side || !amount) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  const tx = await getDonateTx(userAddress, vaultId, side, amount);
  return res.status(StatusCodes.OK).send({ tx });
});
