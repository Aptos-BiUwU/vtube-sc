import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { transactionsRouter } from "./index";

function getAttackTxData(battleId: number, side: boolean, amount: number) {
  return {
    function: `${adminAddress}::scripts::donate`,
    functionArguments: [battleId, side, amount],
  };
}

transactionsRouter.post(
  "/getAttackTxData",
  async (req: Request, res: Response) => {
    const { battleId, side, amount } = req.body;
    if (battleId == undefined || side == undefined || amount == undefined) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const txData = getAttackTxData(battleId, side, amount);
      return res.status(StatusCodes.OK).send({ txData });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);
