import { Account, Hex, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

export function getAccountFromPrivateKey(privateKeyHex: string): Account {
  const privateKey = new Ed25519PrivateKey(privateKeyHex);
  const account = Account.fromPrivateKey({ privateKey });
  return account;
}
