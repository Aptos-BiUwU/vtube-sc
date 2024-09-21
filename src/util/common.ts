import {
  Aptos,
  AptosConfig,
  Network,
  Account,
  Ed25519PrivateKey,
  AnyRawTransaction,
} from "@aptos-labs/ts-sdk";

require("dotenv").config();
const config = new AptosConfig({ network: Network.DEVNET });
export const aptos = new Aptos(config);

export function getAccountFromPrivateKey(privateKey: string) {
  const account = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(privateKey),
  });
  return account;
}

export function getAdminAccount() {
  return getAccountFromPrivateKey(process.env.ADMIN_PRIVATE_KEY!);
}

export function getAdminAddress() {
  return process.env.ADMIN_ADDRESS!;
}

export async function submitTx(signer: Account, tx: AnyRawTransaction) {
  const { hash } = await aptos.signAndSubmitTransaction({
    signer: signer,
    transaction: tx,
  });
  await aptos.waitForTransaction({ transactionHash: hash });
}
