import { adminAddress } from "../admin";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { transactionsRouter } from "./index";

const liquidswapAddress =
  "0x45ef7a3a1221e7c10d190a550aa30fa5bc3208ed06ee3661ec0afa3d8b418580";

function getSwapExactInTxData(
  coinAddress: string,
  amountIn: number,
  amountOutMin: number,
  coinForBiUwU: boolean,
) {
  if (coinForBiUwU) {
    return {
      function: `${liquidswapAddress}::scripts::swap`,
      typeArguments: [
        `${coinAddress}::vtuber_coin::VtuberCoin`,
        `${adminAddress}::biuwu_coin::BiUwU`,
        `${liquidswapAddress}::curves::Uncorrelated`,
      ],
      functionArguments: [amountIn, amountOutMin],
    };
  } else {
    return {
      function: `${liquidswapAddress}::scripts::swap`,
      typeArguments: [
        `${adminAddress}::biuwu_coin::BiUwU`,
        `${coinAddress}::vtuber_coin::VtuberCoin`,
        `${liquidswapAddress}::curves::Uncorrelated`,
      ],
      functionArguments: [amountIn, amountOutMin],
    };
  }
}

transactionsRouter.post(
  "/getSwapExactInTxData",
  async (req: Request, res: Response) => {
    const { coinAddress, amountIn, amountOutMin, coinForBiUwU } = req.body;
    if (
      coinAddress == undefined ||
      amountIn == undefined ||
      amountOutMin == undefined ||
      coinForBiUwU == undefined
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const txData = getSwapExactInTxData(
        coinAddress,
        amountIn,
        amountOutMin,
        coinForBiUwU,
      );
      return res.status(StatusCodes.OK).send({ txData });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);

function getSwapExactOutTxData(
  coinAddress: string,
  amountInMax: number,
  amountOut: number,
  coinForBiUwU: boolean,
) {
  if (coinForBiUwU) {
    return {
      function: `${liquidswapAddress}::scripts::swap_into`,
      typeArguments: [
        `${coinAddress}::vtuber_coin::VtuberCoin`,
        `${adminAddress}::biuwu_coin::BiUwU`,
        `${liquidswapAddress}::curves::Uncorrelated`,
      ],
      functionArguments: [amountInMax, amountOut],
    };
  } else {
    return {
      function: `${liquidswapAddress}::scripts::swap_into`,
      typeArguments: [
        `${adminAddress}::biuwu_coin::BiUwU`,
        `${coinAddress}::vtuber_coin::VtuberCoin`,
        `${liquidswapAddress}::curves::Uncorrelated`,
      ],
      functionArguments: [amountInMax, amountOut],
    };
  }
}

transactionsRouter.post(
  "/getSwapExactOutTxData",
  async (req: Request, res: Response) => {
    const { coinAddress, amountOut, amountInMax, coinForBiUwU } = req.body;
    if (
      coinAddress == undefined ||
      amountOut == undefined ||
      amountInMax == undefined ||
      coinForBiUwU == undefined
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const txData = getSwapExactOutTxData(
        coinAddress,
        amountOut,
        amountInMax,
        coinForBiUwU,
      );
      return res.status(StatusCodes.OK).send({ txData });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);

function getAddLiquidityTxData(
  coinAddress: string,
  amountBiUwU: number,
  amountCoin: number,
) {
  return {
    function: `${liquidswapAddress}::scripts::add_liquidity`,
    typeArguments: [
      `${adminAddress}::biuwu_coin::BiUwU`,
      `${coinAddress}::vtuber_coin::VtuberCoin`,
      `${liquidswapAddress}::curves::Uncorrelated`,
    ],
    functionArguments: [
      amountBiUwU,
      Math.floor((amountBiUwU * 95) / 100),
      amountCoin,
      Math.floor((amountCoin * 95) / 100),
    ],
  };
}

transactionsRouter.post(
  "/getAddLiquidityTxData",
  async (req: Request, res: Response) => {
    const { coinAddress, amountBiUwU, amountCoin } = req.body;
    if (
      coinAddress == undefined ||
      amountBiUwU == undefined ||
      amountCoin == undefined
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const txData = getAddLiquidityTxData(
        coinAddress,
        amountBiUwU,
        amountCoin,
      );
      return res.status(StatusCodes.OK).send({ txData });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);

function getRemoveLiquidityTxData(
  coinAddress: string,
  amountLiquidity: number,
  amountBiUwUMin: number,
  amountCoinMin: number,
) {
  return {
    function: `${liquidswapAddress}::scripts::remove_liquidity`,
    typeArguments: [
      `${adminAddress}::biuwu_coin::BiUwU`,
      `${coinAddress}::vtuber_coin::VtuberCoin`,
      `${liquidswapAddress}::curves::Uncorrelated`,
    ],
    functionArguments: [amountLiquidity, amountBiUwUMin, amountCoinMin],
  };
}

transactionsRouter.post(
  "/getRemoveLiquidityTxData",
  async (req: Request, res: Response) => {
    const { coinAddress, amountLiquidity, amountBiUwUMin, amountCoinMin } =
      req.body;
    if (
      coinAddress == undefined ||
      amountLiquidity == undefined ||
      amountBiUwUMin == undefined ||
      amountCoinMin == undefined
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing required fields");
    }
    try {
      const txData = getRemoveLiquidityTxData(
        coinAddress,
        amountLiquidity,
        amountBiUwUMin,
        amountCoinMin,
      );
      return res.status(StatusCodes.OK).send({ txData });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  },
);
