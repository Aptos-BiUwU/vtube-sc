import { aptos, submitTx } from "../utils";
import { adminAccount, adminAddress } from "./init";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { adminRouter } from "./index";

export async function startCampaign(coinAddress: string, target: number) {
  const tx = await aptos.transaction.build.simple({
    sender: adminAddress,
    data: {
      function: `${adminAddress}::campaigns::start_campaign`,
      functionArguments: [coinAddress, target],
    },
  });
  const events = await submitTx(adminAccount, tx);
  for (const event of events) {
    if (event.type.includes("campaigns::CampaignStarted")) {
      return { campaign_id: event.data.campaign_id };
    }
  }
}

adminRouter.post("/startCampaign", async (req: Request, res: Response) => {
  const { coinAddress, target } = req.body;
  if (coinAddress == undefined || target == undefined) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  try {
    const { campaign_id } = (await startCampaign(coinAddress, target))!;
    return res.status(StatusCodes.OK).send({ campaign_id });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});
