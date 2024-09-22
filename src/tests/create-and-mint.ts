import { getRegisterCoinTx } from "../transactions";
import { createCoin, adminAddress, adminAccount, mintCoin } from "../admin";
import { getAccountFromPrivateKey, submitTx } from "../utils";

async function createAndMint() {
  const { coinPrivateKey } = await createCoin("VtuberCoin", "VTC");

  const coinAccount = getAccountFromPrivateKey(coinPrivateKey);
  const registerCoinTx = await getRegisterCoinTx(
    adminAddress,
    coinAccount.accountAddress.toString(),
  );
  await submitTx(adminAccount, registerCoinTx);

  await mintCoin(coinPrivateKey, adminAddress, 1000);
}

createAndMint();
