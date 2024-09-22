import {
  adminAccount,
  adminAddress,
  initialize,
  createSubscriptionPlan,
  mintBiUwU,
  updateSubscriptionPlan,
} from "../admin";
import { getDepositTx, getUpdateTierTx } from "../transactions";
import { submitTx } from "../utils";
import { viewIsActive } from "../views";

async function test() {
  await createSubscriptionPlan(
    "0x5c7e74cba10d056ecc53fd3c7f99bb1b0bfcf241a566d126206fed11785e30b5",
    [0, 10, 20, 30],
    30,
  );
  await updateSubscriptionPlan(
    "0x5c7e74cba10d056ecc53fd3c7f99bb1b0bfcf241a566d126206fed11785e30b5",
    [0, 100, 200, 300],
    3600000,
  );

  await initialize();
  await mintBiUwU(adminAddress, 1000);
  const depositTx = await getDepositTx(
    adminAddress,
    "0x5c7e74cba10d056ecc53fd3c7f99bb1b0bfcf241a566d126206fed11785e30b5",
    200,
  );
  await submitTx(adminAccount, depositTx);

  const updateTierTx = await getUpdateTierTx(
    adminAddress,
    "0x5c7e74cba10d056ecc53fd3c7f99bb1b0bfcf241a566d126206fed11785e30b5",
    2,
  );
  await submitTx(adminAccount, updateTierTx);
  console.log(
    "isActive: ",
    await viewIsActive(
      adminAddress,
      "0x5c7e74cba10d056ecc53fd3c7f99bb1b0bfcf241a566d126206fed11785e30b5",
    ),
  );

  const updateTierTx2 = await getUpdateTierTx(
    adminAddress,
    "0x5c7e74cba10d056ecc53fd3c7f99bb1b0bfcf241a566d126206fed11785e30b5",
    3,
  );
  await submitTx(adminAccount, updateTierTx2);
  console.log(
    "isActive: ",
    await viewIsActive(
      adminAddress,
      "0x5c7e74cba10d056ecc53fd3c7f99bb1b0bfcf241a566d126206fed11785e30b5",
    ),
  );
}

test();
