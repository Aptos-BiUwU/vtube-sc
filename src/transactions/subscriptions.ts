import { aptos, getAdminAddress } from "../util";

export async function getDepositTx(
  userAddress: string,
  coinAddress: string,
  amount: number,
) {
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    data: {
      function: `${getAdminAddress()}::scripts::deposit`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [amount],
    },
  });
  return tx;
}

export async function getUpdateTierTx(
  userAddress: string,
  coinAddress: string,
  tier: number,
) {
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    data: {
      function: `${getAdminAddress()}::scripts::update_tier`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [tier],
    },
  });
  return tx;
}