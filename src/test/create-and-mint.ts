import { getRegisterCoinTx } from "../transaction";
import { createCoin, mintCoin } from "../admin";
import { getAccountFromPrivateKey, getAdminAccount, submitTx } from "../util";

require("dotenv").config();
const adminAccount = getAdminAccount();

async function createAndMint() {
  const coinAccountPrivateKey = await createCoin("VtuberCoin", "VTC");

  const coinAccount = getAccountFromPrivateKey(coinAccountPrivateKey);
  const registerCoinTx = await getRegisterCoinTx(
    adminAccount.accountAddress.toString(),
    coinAccount.accountAddress.toString(),
  );
  await submitTx(adminAccount, registerCoinTx);

  await mintCoin(
    coinAccountPrivateKey,
    adminAccount.accountAddress.toString(),
    1000,
  );
}

createAndMint();
