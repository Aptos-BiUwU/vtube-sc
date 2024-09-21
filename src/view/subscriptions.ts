import { aptos, getAdminAddress } from "../util";

export async function viewIsActive(userAddress: string, coinAddress: string) {
  return await aptos.view({
    payload: {
      function: `${getAdminAddress()}::scripts::is_active`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [userAddress],
    },
  });
}
