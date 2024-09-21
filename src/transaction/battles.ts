import { aptos, getAdminAddress } from "../util";

export async function getDonateTx(
  userAddress: string,
  vaultId: number,
  side: boolean,
  amount: number,
) {
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    data: {
      function: `${getAdminAddress()}::scripts::donate`,
      functionArguments: [vaultId, side, amount],
    },
  });
  return tx;
}
