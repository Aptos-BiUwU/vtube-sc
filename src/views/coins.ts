import { aptos } from "../utils";
import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { viewsRouter } from "./index";

export async function viewCoinBalance(
  userAddress: string,
  coinAddress: string,
) {
  return await aptos.view({
    payload: {
      function: `0x1::coin::balance`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [userAddress],
    },
  });
}

viewsRouter.post("/viewCoinBalance", async (req: Request, res: Response) => {
  const { userAddress, coinAddress } = req.body;
  if (userAddress == undefined || coinAddress == undefined) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  try {
    const balance = await viewCoinBalance(userAddress, coinAddress);
    return res.status(StatusCodes.OK).send({ balance });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});

export async function viewCoinRegistered(
  userAddress: string,
  coinAddress: string,
) {
  return await aptos.view({
    payload: {
      function: `0x1::coin::is_account_registered`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [userAddress],
    },
  });
}

viewsRouter.post("/viewCoinRegistered", async (req: Request, res: Response) => {
  const { userAddress, coinAddress } = req.body;
  if (userAddress == undefined || coinAddress == undefined) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  try {
    const registered = await viewCoinRegistered(userAddress, coinAddress);
    return res.status(StatusCodes.OK).send({ registered });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});

export async function viewBiUwUBalance(userAddress: string) {
  return await aptos.view({
    payload: {
      function: `0x1::coin::balance`,
      typeArguments: [`${adminAddress}::biuwu_coin::BiUwU`],
      functionArguments: [userAddress],
    },
  });
}

viewsRouter.post("/viewBiUwUBalance", async (req: Request, res: Response) => {
  const { userAddress } = req.body;
  if (userAddress == undefined) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  try {
    const balance = await viewBiUwUBalance(userAddress);
    return res.status(StatusCodes.OK).send({ balance });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});

export async function viewBiUwURegistered(userAddress: string) {
  return await aptos.view({
    payload: {
      function: `0x1::coin::is_account_registered`,
      typeArguments: [`${adminAddress}::biuwu_coin::BiUwU`],
      functionArguments: [userAddress],
    },
  });
}

viewsRouter.post(
  "/viewBiUwURegistered",
  async (req: Request, res: Response) => {
    const { userAddress } = req.body;
    if (userAddress == undefined) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const registered = await viewBiUwURegistered(userAddress);
      return res.status(StatusCodes.OK).send({ registered });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);
