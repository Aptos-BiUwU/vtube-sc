import { aptos } from "../utils";
import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { viewsRouter } from "./index";

export async function viewBattleInfo(battleId: number) {
  return await aptos.view({
    payload: {
      function: `${adminAddress}::scripts::get_battle_info`,
      functionArguments: [battleId],
    },
  });
}

viewsRouter.post("/viewBattleInfo", async (req: Request, res: Response) => {
  const { battleId } = req.body;
  if (battleId == undefined) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  try {
    const info = await viewBattleInfo(battleId);
    return res.status(StatusCodes.OK).send(info);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});
