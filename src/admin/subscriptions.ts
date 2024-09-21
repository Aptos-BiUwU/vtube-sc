import { aptos, submitTx } from "../util";
import { getAdminAccount } from "../util";

export async function createSubscriptionPlan(
  coinAddress: string,
  prices: number[],
  period: number,
) {
  const adminAccount = getAdminAccount();
  const tx = await aptos.transaction.build.simple({
    sender: adminAccount.accountAddress,
    data: {
      function: `${adminAccount.accountAddress}::subscriptions::create_subscription_plan`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [prices, period],
    },
  });
  await submitTx(adminAccount, tx);
}

export async function updateSubscriptionPlan(
  coinAddress: string,
  prices: number[],
  period: number,
) {
  const adminAccount = getAdminAccount();
  const tx = await aptos.transaction.build.simple({
    sender: adminAccount.accountAddress,
    data: {
      function: `${adminAccount.accountAddress}::subscriptions::update_subscription_plan`,
      typeArguments: [`${coinAddress}::vtuber_coin::VtuberCoin`],
      functionArguments: [prices, period],
    },
  });
  await submitTx(adminAccount, tx);
}
