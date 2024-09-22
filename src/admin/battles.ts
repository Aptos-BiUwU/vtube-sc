import { aptos, submitTx } from "../utils";
import { adminAccount, adminAddress } from "./init";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { adminRouter } from "./index";

/**
 * Starts a battle between two addresses.
 * @param coinAddress0 - The address of the first coin.
 * @param coinAddress1 - The address of the second coin.
 * @returns The vault ID of the battle.
 */
export async function startBattle(coinAddress0: string, coinAddress1: string) {
  const tx = await aptos.transaction.build.simple({
    sender: adminAddress,
    data: {
      function: `${adminAddress}::battles::start_battle`,
      functionArguments: [coinAddress0, coinAddress1],
    },
  });
  const events = await submitTx(adminAccount, tx);
  for (const event of events) {
    if (event.type.includes("battles::BattleStarted")) {
      return { vault_id: event.data.vault_id };
    }
  }
  return { vault_id: null };
}

adminRouter.post("/startBattle", async (req: Request, res: Response) => {
  const { coinAddress0, coinAddress1 } = req.body;
  if (!coinAddress0 || !coinAddress1) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  const { vault_id } = await startBattle(coinAddress0, coinAddress1);
  if (!vault_id) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Failed to start battle");
  }
  return res.status(StatusCodes.OK).send({ vault_id });
});

/**
 * Stops a battle.
 * @param vaultId - The vault ID of the battle.
 */
export async function stopBattle(vaultId: number) {
  const tx = await aptos.transaction.build.simple({
    sender: adminAddress,
    data: {
      function: `${adminAddress}::battles::stop_battle`,
      functionArguments: [vaultId],
    },
  });
  const events = await submitTx(adminAccount, tx);
  for (const event of events) {
    if (event.type.includes("battles::BattleStopped")) {
      return { winner: event.data.winner, prize: event.data.prize };
    }
  }
}

adminRouter.post("/stopBattle", async (req: Request, res: Response) => {
  const { vaultId } = req.body;
  if (!vaultId) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  const result = await stopBattle(vaultId);
  if (!result) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Failed to stop battle");
  }
  return res.status(StatusCodes.OK).send(result);
});
