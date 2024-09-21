import { mintBiUwU, startBattle, stopBattle } from "../admin";
import { getDonateTx } from "../transactions/battles";
import { getAdminAccount, submitTx } from "../util";

async function test() {
  // await startBattle(
  //   "0x34470f6a35c0d2e7e44f25d50077b5ef43b6b0c0e8b1304ddb0fe085d4f9b5a8",
  //   "0x317f016c3056445b2365702f726dcc10488bebc6281756842cd98601bc3bbbd1",
  // );

  const adminAccount = getAdminAccount();

  // await mintBiUwU(adminAccount.accountAddress.toString(), 1000);
  // await mintBiUwU("0x34470f6a35c0d2e7e44f25d50077b5ef43b6b0c0e8b1304ddb0fe085d4f9b5a8", 1000);
  const donateTx = await getDonateTx(
    adminAccount.accountAddress.toString(),
    2,
    true,
    100,
  );
  await submitTx(adminAccount, donateTx);

  await stopBattle(2);
}

test();