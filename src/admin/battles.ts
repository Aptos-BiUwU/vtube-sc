import { aptos, submitTx, getAdminAccount } from "../util";

const adminAccount = getAdminAccount();

export async function initialize() {
  let tx = await aptos.transaction.build.simple({
    sender: adminAccount.accountAddress,
    data: {
      function: `${adminAccount.accountAddress}::biuwu_coin::initialize`,
      functionArguments: [],
    },
  });
  await submitTx(adminAccount, tx);

  tx = await aptos.transaction.build.simple({
    sender: adminAccount.accountAddress,
    data: {
      function: `${adminAccount.accountAddress}::battles::initialize`,
      typeArguments: [],
      functionArguments: [],
    },
  });
  await submitTx(adminAccount, tx);
}

export async function startBattle(coinAddress0: string, coinAddress1: string) {
  const tx = await aptos.transaction.build.simple({
    sender: adminAccount.accountAddress,
    data: {
      function: `${adminAccount.accountAddress}::battles::start_battle`,
      functionArguments: [coinAddress0, coinAddress1],
    },
  });
  await submitTx(adminAccount, tx);
}

export async function stopBattle(vaultId: number) {
  const tx = await aptos.transaction.build.simple({
    sender: adminAccount.accountAddress,
    data: {
      function: `${adminAccount.accountAddress}::battles::stop_battle`,
      functionArguments: [vaultId],
    },
  });
  await submitTx(adminAccount, tx);
}
