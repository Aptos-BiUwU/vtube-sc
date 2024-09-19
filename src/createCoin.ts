import { Account, UserTransactionResponse } from "@aptos-labs/ts-sdk";
import "dotenv/config";

import { aptos } from "./utils/aptos";
import { compilePackage, getPackageBytes, publishPackage } from "./utils/build";
import { getAccountFromPrivateKey } from "./utils/account";

const biuwuAdmin = getAccountFromPrivateKey(process.env.PRIVATE_KEY!);

export async function createCoin(name: string, symbol: string) {
  const coinAccount = Account.generate();
  await aptos.fundAccount({
    accountAddress: coinAccount.accountAddress,
    amount: 100_000_000,
  });

  console.log(`Creating coin account: ${coinAccount.accountAddress}`);

  await compilePackage(
    "move/vtuber_coin",
    "move/vtuber_coin/vtuber_coin.json",
    [{ name: "vtuber_coin", address: coinAccount.accountAddress }]
  );
  const { metadataBytes, moduleBytecode } = await getPackageBytes(
    "move/vtuber_coin/vtuber_coin.json"
  );
  await publishPackage(coinAccount, metadataBytes, moduleBytecode);

  const tx = await aptos.transaction.build.simple({
    sender: coinAccount.accountAddress,
    data: {
      function: `${coinAccount.accountAddress}::vtuber_coin::create_coin`,
      functionArguments: [name, symbol],
    },
  });
  const { hash } = await aptos.signAndSubmitTransaction({
    signer: coinAccount,
    transaction: tx,
  });
  const txResponse = await aptos.waitForTransaction({ transactionHash: hash });

  return coinAccount.privateKey.toString();
}
