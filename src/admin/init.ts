import { aptos, submitTx, getAccountFromPrivateKey } from "../utils";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { adminRouter } from "./index";
import * as dotenv from "dotenv";

dotenv.config();
export const adminAccount = getAccountFromPrivateKey(
  process.env.ADMIN_PRIVATE_KEY!,
);
export const adminAddress = adminAccount.accountAddress.toString();

/**
 * Initializes the biuwu_coin and battles modules.
 */
export async function initialize() {
  let tx = await aptos.transaction.build.simple({
    sender: adminAddress,
    data: {
      function: `${adminAddress}::biuwu_coin::initialize`,
      functionArguments: [],
    },
  });
  await submitTx(adminAccount, tx);

  tx = await aptos.transaction.build.simple({
    sender: adminAddress,
    data: {
      function: `${adminAddress}::battles::initialize`,
      typeArguments: [],
      functionArguments: [],
    },
  });
  await submitTx(adminAccount, tx);

  tx = await aptos.transaction.build.simple({
    sender: adminAddress,
    data: {
      function: `${adminAddress}::campaigns::initialize`,
      typeArguments: [],
      functionArguments: [],
    },
  });
  await submitTx(adminAccount, tx);
}

adminRouter.post("/initialize", async (req: Request, res: Response) => {
  try {
    await initialize();
    return res.status(StatusCodes.OK).send("Initialized");
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});
