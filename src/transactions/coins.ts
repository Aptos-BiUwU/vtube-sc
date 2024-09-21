import { aptos, getAdminAddress } from "../util";

export async function getRegisterCoinTx(
  userAddress: string,
  coinAddress: string,
) {
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    data: {
      function: `0x1::managed_coin::register`,
      functionArguments: [],
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
    },
  });
  return tx;
}

export async function getRegisterBiUwUTx(userAddress: string) {
  const tx = await aptos.transaction.build.simple({
    sender: userAddress,
    data: {
      function: `0x1::managed_coin::register`,
      functionArguments: [],
      typeArguments: [`${getAdminAddress()}::biuwu_coin::BiUwU`],
    },
  });
  return tx;
}

export async function getTransferCoinTx(
  coinAddress: string,
  senderAddress: string,
  receiverAddress: string,
  amount: number,
) {
  const tx = await aptos.transaction.build.simple({
    sender: senderAddress,
    data: {
      function: `0x1::coin::transfer`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [receiverAddress, amount],
    },
  });
  return tx;
}
