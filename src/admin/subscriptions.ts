import { aptos, submitTx } from "../utils";
import { adminAccount, adminAddress } from "./init";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { adminRouter } from "./index";

export async function createSubscriptionPlan(
  coinAddress: string,
  prices: number[],
  period: number,
) {
  const tx = await aptos.transaction.build.simple({
    sender: adminAddress,
    data: {
      function: `${adminAddress}::subscriptions::create_subscription_plan`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [prices, period],
    },
  });
  await submitTx(adminAccount, tx);
}

adminRouter.post(
  "/createSubscriptionPlan",
  async (req: Request, res: Response) => {
    const { coinAddress, prices, period } = req.body;
    if (
      coinAddress == undefined ||
      prices == undefined ||
      period == undefined
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      await createSubscriptionPlan(coinAddress, prices, period);
      return res.status(StatusCodes.OK).send("Subscription plan created");
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);

export async function updateSubscriptionPlan(
  coinAddress: string,
  prices: number[],
  period: number,
) {
  const tx = await aptos.transaction.build.simple({
    sender: adminAddress,
    data: {
      function: `${adminAddress}::subscriptions::update_subscription_plan`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [prices, period],
    },
  });
  await submitTx(adminAccount, tx);
}

adminRouter.post(
  "/updateSubscriptionPlan",
  async (req: Request, res: Response) => {
    const { coinAddress, prices, period } = req.body;
    if (
      coinAddress == undefined ||
      prices == undefined ||
      period == undefined
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      await updateSubscriptionPlan(coinAddress, prices, period);
      return res.status(StatusCodes.OK).send("Subscription plan updated");
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);
