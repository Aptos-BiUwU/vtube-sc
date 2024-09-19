import { AccountAddress } from "@aptos-labs/ts-sdk";
import { aptos } from "./utils/aptos";
import { getAccountFromPrivateKey } from "./utils/account";

async function mint(
  coinAccountPrivateKey: string,
  dstAddress: AccountAddress,
  amount: number
) {
  const coinAccount = getAccountFromPrivateKey(coinAccountPrivateKey);
  const tx = await aptos.transaction.build.simple({
    sender: coinAccount.accountAddress,
    data: {
      function: `${coinAccount.accountAddress}::vtube_coin::mint`,
      functionArguments: [dstAddress, amount],
    },
  });
  const { hash } = await aptos.signAndSubmitTransaction({
    signer: coinAccount,
    transaction: tx,
  });
  await aptos.waitForTransaction({ transactionHash: hash });
}
