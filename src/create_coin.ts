import { Account, UserTransactionResponse } from "@aptos-labs/ts-sdk";
import "dotenv/config";

import { aptos } from "./utils/aptos";
import { compilePackage, getPackageBytes, publishPackage } from "./utils/build";
import { getAccountFromPrivateKey } from "./utils/account";

const vtubeAdmin = getAccountFromPrivateKey(process.env.PRIVATE_KEY!);

async function createCoin(name: string, symbol: string) {
  const coinAccount = Account.generate();
  await aptos.fundAccount({
    accountAddress: coinAccount.accountAddress,
    amount: 100_000_000,
  });

  await compilePackage("move/vtube_coin", "move/vtube_coin/vtube_coin.json", [
    { name: "vtube_coin", address: coinAccount.accountAddress },
  ]);
  const { metadataBytes, moduleBytecode } = await getPackageBytes(
    "move/vtube_coin/vtube_coin.json"
  );
  await publishPackage(coinAccount, metadataBytes, moduleBytecode);

  const tx = await aptos.transaction.build.simple({
    sender: vtubeAdmin.accountAddress,
    data: {
      function: `${coinAccount.accountAddress}::vtube_coin::create_coin`,
      functionArguments: [name, symbol],
    },
  });
  const { hash } = await aptos.signAndSubmitTransaction({
    signer: vtubeAdmin,
    transaction: tx,
  });
  const txResponse = await aptos.waitForTransaction({ transactionHash: hash });
  let events = (txResponse as UserTransactionResponse).events;
  console.log(JSON.stringify(events, null, 2));
}

createCoin("VTUBE Coin", "VTUBE");
