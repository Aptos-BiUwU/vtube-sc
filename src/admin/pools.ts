import { aptos, getAccountFromPrivateKey, submitTx } from "../utils";
import { adminAccount, adminAddress } from "./init";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { adminRouter, mintBiUwU, mintCoin } from "./index";

const liquidswapAddress =
  "0x45ef7a3a1221e7c10d190a550aa30fa5bc3208ed06ee3661ec0afa3d8b418580";

async function createPool(
  coinPrivateKey: string,
  amountBiUwU: number,
  amountCoin: number,
) {
  await mintBiUwU(adminAddress, amountBiUwU);
  await mintCoin(coinPrivateKey, adminAddress, amountCoin);

  const coinAccount = getAccountFromPrivateKey(coinPrivateKey);

  const tx = await aptos.transaction.build.simple({
    sender: adminAddress,
    data: {
      function: `${liquidswapAddress}::scripts::register_pool_and_add_liquidity`,
      typeArguments: [
        `${adminAddress}::biuwu_coin::BiUwU`,
        `${coinAccount.accountAddress}::vtuber_coin::VtuberCoin`,
        `${liquidswapAddress}::curves::Uncorrelated`,
      ],
      functionArguments: [
        amountBiUwU,
        Math.floor((amountBiUwU * 95) / 100),
        amountCoin,
        Math.floor((amountCoin * 95) / 100),
      ],
    },
  });
  await submitTx(adminAccount, tx);
}

adminRouter.post("/createPool", async (req: Request, res: Response) => {
  const { coinPrivateKey, amountBiUwU, amountCoin } = req.body;
  if (!coinPrivateKey || !amountBiUwU || !amountCoin) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Missing required fields",
    });
  }
  try {
    await createPool(coinPrivateKey, amountBiUwU, amountCoin);
    res.status(StatusCodes.OK).json({ success: true });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});
