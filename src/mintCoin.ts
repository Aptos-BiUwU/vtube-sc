import { aptos } from "./utils/aptos";
import { getAccountFromPrivateKey } from "./utils/account";

export async function mintCoin(
  coinAccountPrivateKey: string,
  dstAddress: string,
  amount: number
) {
  const coinAccount = getAccountFromPrivateKey(coinAccountPrivateKey);
  const tx = await aptos.transaction.build.simple({
    sender: coinAccount.accountAddress,
    data: {
      function: `0x1::managed_coin::mint`,
      functionArguments: [dstAddress, amount],
    },
    withFeePayer: false,
  });
  const { hash } = await aptos.signAndSubmitTransaction({
    signer: coinAccount,
    transaction: tx,
  });
  const txResponse = await aptos.waitForTransaction({ transactionHash: hash });
}
