import { aptos } from "../utils";
import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { viewsRouter } from "./index";

async function viewIsActive(userAddress: string, coinAddress: string) {
  return await aptos.view({
    payload: {
      function: `${adminAddress}::scripts::is_active`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [userAddress],
    },
  });
}

viewsRouter.post("/viewIsActive", async (req: Request, res: Response) => {
  const { userAddress, coinAddress } = req.body;
  if (userAddress == undefined || coinAddress == undefined) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  try {
    const isActive = await viewIsActive(userAddress, coinAddress);
    return res.status(StatusCodes.OK).send({ isActive });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});

async function viewSubscriptionPlanInfo(coinAddress: string) {
  return await aptos.view({
    payload: {
      function: `${adminAddress}::scripts::get_subscription_plan_info`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [],
    },
  });
}

viewsRouter.post(
  "/viewSubscriptionPlanInfo",
  async (req: Request, res: Response) => {
    const { coinAddress } = req.body;
    if (coinAddress == undefined) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const subscriptionPlanInfo = await viewSubscriptionPlanInfo(coinAddress);
      return res.status(StatusCodes.OK).send({ subscriptionPlanInfo });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);

async function viewSubscriptionInfo(userAddress: string, coinAddress: string) {
  return await aptos.view({
    payload: {
      function: `${adminAddress}::scripts::get_subscription_info`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [userAddress],
    },
  });
}

viewsRouter.post(
  "/viewSubscriptionInfo",
  async (req: Request, res: Response) => {
    const { userAddress, coinAddress } = req.body;
    if (userAddress == undefined || coinAddress == undefined) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const subscriptionInfo = await viewSubscriptionInfo(
        userAddress,
        coinAddress,
      );
      return res.status(StatusCodes.OK).send({ subscriptionInfo });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);
