import { Account, AccountAddress } from "@aptos-labs/ts-sdk";
import { readFile } from "fs/promises";

import { aptos } from "./common";
import util from "util";
import { exec } from "child_process";

const promisifiedExec = util.promisify(exec);

export async function compilePackage(
  packageDir: string,
  outputFile: string,
  namedAddresses: Array<{ name: string; address: AccountAddress }>,
) {
  const addressArg = namedAddresses
    .map(({ name, address }) => `${name}=${address}`)
    .join(" ");
  const compileCommand = `aptos move build-publish-payload \\
                          --json-output-file ${outputFile} \\
                          --package-dir ${packageDir} \\
                          --named-addresses ${addressArg} \\
                          --assume-yes`;
  await promisifiedExec(compileCommand);
}

export async function getPackageBytes(packagePath: string) {
  const jsonData = JSON.parse(await readFile(packagePath, "utf-8"));

  const metadataBytes = jsonData.args[0].value as Uint8Array;
  const moduleBytecode = jsonData.args[1].value as Uint8Array[];

  return { metadataBytes, moduleBytecode };
}

export async function publishPackage(
  account: Account,
  metadataBytes: Uint8Array,
  moduleBytecode: Uint8Array[],
) {
  const tx = await aptos.publishPackageTransaction({
    account: account.accountAddress,
    metadataBytes: metadataBytes,
    moduleBytecode: moduleBytecode,
  });
  const { hash } = await aptos.signAndSubmitTransaction({
    signer: account,
    transaction: tx,
  });
  await aptos.waitForTransaction({ transactionHash: hash });
}
