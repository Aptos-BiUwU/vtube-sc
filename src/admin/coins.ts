import {
  aptos,
  getAccountFromPrivateKey,
  compilePackage,
  getPackageBytes,
  publishPackage,
  submitTx,
} from "../utils";
import { adminAccount, adminAddress } from "./init";
import { Account } from "@aptos-labs/ts-sdk";
import { readFile, writeFile } from "fs/promises";
import { getRegisterCoinTxData, getRegisterBiUwUTxData } from "../transactions";
import * as path from "path";
import * as os from "os";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { adminRouter } from "./index";
import { InputEntryFunctionData } from "@aptos-labs/ts-sdk";

export async function createCoin(name: string, symbol: string) {
  const coinAccount = Account.generate();
  const coinAddress = coinAccount.accountAddress.toString();
  await aptos.fundAccount({
    accountAddress: coinAccount.accountAddress,
    amount: 100_000_000,
  });

  await compilePackage(
    path.resolve(__dirname, "../../move/vtuber_coin"),
    path.resolve(os.tmpdir(), "vtuber_coin.json"),
    [{ name: "vtuber_coin", address: coinAccount.accountAddress }],
  );
  const { metadataBytes, moduleBytecode } = await getPackageBytes(
    path.resolve(os.tmpdir(), "vtuber_coin.json"),
  );
  await publishPackage(coinAccount, metadataBytes, moduleBytecode);

  let tx = await aptos.transaction.build.simple({
    sender: coinAccount.accountAddress,
    data: {
      function: `${coinAccount.accountAddress}::vtuber_coin::initialize`,
      functionArguments: [name, symbol],
    },
  });
  await submitTx(coinAccount, tx);

  const data = await readFile("coin-accounts-list.json", "utf-8");
  const jsonData = JSON.parse(data);
  jsonData.coinAccounts.push({
    address: coinAddress,
    privateKey: coinAccount.privateKey.toString(),
  });
  await writeFile("coin-accounts-list.json", JSON.stringify(jsonData, null, 2));

  tx = await aptos.transaction.build.simple({
    sender: coinAccount.accountAddress,
    data: getRegisterBiUwUTxData() as InputEntryFunctionData,
  });
  await submitTx(coinAccount, tx);

  tx = await aptos.transaction.build.simple({
    sender: adminAddress,
    data: getRegisterCoinTxData(coinAddress) as InputEntryFunctionData,
  });
  await submitTx(adminAccount, tx);

  return {
    coinAddress: coinAddress,
    coinPrivateKey: coinAccount.privateKey.toString(),
  };
}

adminRouter.post("/createCoin", async (req: Request, res: Response) => {
  const { name, symbol } = req.body;
  if (name == undefined || symbol == undefined) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  try {
    const { coinAddress, coinPrivateKey } = await createCoin(name, symbol);
    return res.status(StatusCodes.OK).send({ coinAddress, coinPrivateKey });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});

export async function mintCoin(
  coinPrivateKey: string,
  userAddress: string,
  amount: number,
) {
  const coinAccount = getAccountFromPrivateKey(coinPrivateKey);
  const tx = await aptos.transaction.build.simple({
    sender: coinAccount.accountAddress,
    data: {
      function: `0x1::managed_coin::mint`,
      typeArguments: [`${coinAccount.accountAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [userAddress, amount],
    },
  });
  await submitTx(coinAccount, tx);
}

adminRouter.post("/mintCoin", async (req: Request, res: Response) => {
  const { coinPrivateKey, userAddress, amount } = req.body;
  if (
    coinPrivateKey == undefined ||
    userAddress == undefined ||
    amount == undefined
  ) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  try {
    await mintCoin(coinPrivateKey, userAddress, amount);
    return res.status(StatusCodes.OK).send("Coins minted");
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});

export async function mintBiUwU(userAddress: string, amount: number) {
  const tx = await aptos.transaction.build.simple({
    sender: adminAddress,
    data: {
      function: `0x1::managed_coin::mint`,
      typeArguments: [`${adminAddress}::biuwu_coin::BiUwU`],
      functionArguments: [userAddress, amount],
    },
  });
  await submitTx(adminAccount, tx);
}

adminRouter.post("/mintBiUwU", async (req: Request, res: Response) => {
  const { userAddress, amount } = req.body;
  if (userAddress == undefined || amount == undefined) {
    return res.status(StatusCodes.BAD_REQUEST).send("Missing required fields");
  }
  try {
    await mintBiUwU(userAddress, amount);
    return res.status(StatusCodes.OK).send("BiUwU minted");
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});
