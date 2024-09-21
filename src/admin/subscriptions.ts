import { aptos, submitTx, getAdminAccount } from "../util";

const adminAccount = getAdminAccount();

export async function createSubscriptionPlan(
  coinAddress: string,
  prices: number[],
  period: number,
) {
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
