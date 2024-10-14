import {
  Aptos,
  AptosConfig,
  Network,
  Account,
  Ed25519PrivateKey,
  AnyRawTransaction,
  UserTransactionResponse,
} from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(config);

export function getAccountFromPrivateKey(privateKey: string) {
  const account = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(privateKey),
  });
  return account;
}

export async function submitTx(signer: Account, tx: AnyRawTransaction) {
  try {
    const { hash } = await aptos.signAndSubmitTransaction({
      signer: signer,
      transaction: tx,
    });
    const { events } = (await aptos.waitForTransaction({
      transactionHash: hash,
    })) as UserTransactionResponse;
    return events;
  } catch (err) {
    console.error(err);
  }
  return [];
}
