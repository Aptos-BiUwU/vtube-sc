import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { transactionsRouter } from "./index";

function getDonateTxData(campaignId: number, amount: number) {
  return {
    function: `${adminAddress}::scripts::donate`,
    functionArguments: [campaignId, amount],
  };
}

transactionsRouter.post(
  "/getDonateTxData",
  async (req: Request, res: Response) => {
    const { campaignId, amount } = req.body;
    if (campaignId == undefined || amount == undefined) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const txData = getDonateTxData(campaignId, amount);
      return res.status(StatusCodes.OK).send({ txData });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);
