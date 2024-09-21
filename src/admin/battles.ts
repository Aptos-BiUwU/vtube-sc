import { aptos, submitTx, getAdminAccount } from "../util";

const adminAccount = getAdminAccount();

/**
 * Initializes the biuwu_coin and battles modules.
 */
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

/**
 * Starts a battle between two addresses.
 * @param coinAddress0 - The address of the first coin.
 * @param coinAddress1 - The address of the second coin.
 * @returns The vault ID of the battle.
 */
export async function startBattle(coinAddress0: string, coinAddress1: string) {
  const tx = await aptos.transaction.build.simple({
    sender: adminAccount.accountAddress,
    data: {
      function: `${adminAccount.accountAddress}::battles::start_battle`,
      functionArguments: [coinAddress0, coinAddress1],
    },
  });
  const events = await submitTx(adminAccount, tx);
  for (const event of events) {
    if (event.type.includes("battles::BattleStarted")) {
      return { vault_id: event.data.vault_id };
    }
  }
  return { vault_id: null };
}

/**
 * Stops a battle.
 * @param vaultId - The vault ID of the battle.
 */
export async function stopBattle(vaultId: number) {
  const tx = await aptos.transaction.build.simple({
    sender: adminAccount.accountAddress,
    data: {
      function: `${adminAccount.accountAddress}::battles::stop_battle`,
      functionArguments: [vaultId],
    },
  });
  const events = await submitTx(adminAccount, tx);
  for (const event of events) {
    if (event.type.includes("battles::BattleStopped")) {
      return { winner: event.data.winner, prize: event.data.prize };
    }
  }
}
