import { assert } from "console";
import { initialize, mintBiUwU, startBattle, stopBattle } from "../admin";
import { getDonateTx } from "../transactions/battles";
import { getAdminAccount, submitTx } from "../util";

async function test() {
  const { vault_id } = await startBattle(
    "0x256910a5bc37f11c5566504945a0cd2cbd575e2b7397cc7e5c8a6d74a3072124",
    "0xfd73d3035ccc04c01f290e5fcb253f8c269a8a9464f02c193a79f51252638294",
  );
  assert(vault_id !== null);

  const adminAccount = getAdminAccount();

  await mintBiUwU(adminAccount.accountAddress.toString(), 1000);
  const donateTx = await getDonateTx(
    adminAccount.accountAddress.toString(),
    vault_id,
    true,
    100,
  );
  await submitTx(adminAccount, donateTx);

  console.log(await stopBattle(vault_id));
}

test();
