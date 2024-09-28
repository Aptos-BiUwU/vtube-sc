import { aptos } from "../utils";
import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { viewsRouter } from "./index";

export async function viewCampaignInfo(campaignId: number) {
  return await aptos.view({
    payload: {
      function: `${adminAddress}::scripts::get_campaign_info`,
      functionArguments: [campaignId],
    },
  });
}

viewsRouter.post("/viewCampaignInfo", async (req: Request, res: Response) => {
  const { campaignId } = req.body;
  if (campaignId == undefined) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  try {
    const info = await viewCampaignInfo(campaignId);
    return res.status(StatusCodes.OK).send(info);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});

export async function viewDonationInfo(
  campaignId: number,
  userAddress: string,
) {
  return await aptos.view({
    payload: {
      function: `${adminAddress}::scripts::get_donation_info`,
      functionArguments: [campaignId, userAddress],
    },
  });
}

viewsRouter.post("/viewDonationInfo", async (req: Request, res: Response) => {
  const { campaignId, userAddress } = req.body;
  if (campaignId == undefined || userAddress == undefined) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  try {
    const info = await viewDonationInfo(campaignId, userAddress);
    return res.status(StatusCodes.OK).send(info);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});
