import { createCoin } from "./createCoin";
import { mintCoin } from "./mintCoin";

async function main() {
  const coinAccountPrivateKey = await createCoin("VTuber Coin", "VTC");
  await mintCoin(
    coinAccountPrivateKey,
    "0x0d028638cbfe44d92bb686130abeadbafbce777eb5cc8b75e3d08e835370c59f",
    100
  );
  console.log("Minted 100 VTC to 0x0d028638cbfe44d92bb686130abeadbafbce777eb5cc8b75e3d08e835370c59f");
}

main();
