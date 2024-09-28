import { aptos, submitTx } from "../utils";
import { adminAccount, adminAddress } from "./init";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { adminRouter } from "./index";

/**
 * Starts a battle between two addresses.
 * @param coinAddress0 - The address of the first coin.
 * @param coinAddress1 - The address of the second coin.
 * @returns The battle ID of the battle.
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
      return { battle_id: event.data.battle_id };
    }
  }
}

adminRouter.post("/startBattle", async (req: Request, res: Response) => {
  const { coinAddress0, coinAddress1 } = req.body;
  if (coinAddress0 == undefined || coinAddress1 == undefined) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  try {
    const { battle_id } = (await startBattle(coinAddress0, coinAddress1))!;
    return res.status(StatusCodes.OK).send({ battle_id });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});

/**
 * Stops a battle.
 * @param battleId - The battle ID of the battle.
 */
export async function stopBattle(battleId: number) {
  const tx = await aptos.transaction.build.simple({
    sender: adminAddress,
    data: {
      function: `${adminAddress}::battles::stop_battle`,
      functionArguments: [battleId],
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
  const { battleId } = req.body;
  if (battleId == undefined) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  try {
    const result = await stopBattle(battleId);
    return res.status(StatusCodes.OK).send(result);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});
