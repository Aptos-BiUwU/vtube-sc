#[test_only]
module biuwu::subscription_tests {
    use std::signer;

    use aptos_framework::coin;
    use aptos_framework::managed_coin;
    use aptos_framework::timestamp;

    use biuwu::test_coins::{Self, VtuberCoin};
    use biuwu::subscription;
    use biuwu::biuwu_coin::{Self, BiUwU};
    use biuwu::scripts;

    #[test(account = @0xdead, framework = @0x1, biuwu = @biuwu)]
    public entry fun test_end_to_end(
        account: signer, framework: signer, biuwu: signer
    ) {
        timestamp::set_time_has_started_for_testing(&framework);
        let account_addr = signer::address_of(&account);
        let biuwu_addr = signer::address_of(&biuwu);
        aptos_framework::account::create_account_for_test(account_addr);
        aptos_framework::account::create_account_for_test(biuwu_addr);

        test_coins::create_coin(&biuwu);
        biuwu_coin::create_coin(&biuwu);
        coin::register<VtuberCoin>(&account);
        coin::register<BiUwU>(&account);
        managed_coin::mint<VtuberCoin>(&biuwu, account_addr, 1000);
        managed_coin::mint<BiUwU>(&biuwu, account_addr, 1000);

        let prices: vector<u64> = vector[0, 1000, 2000, 3000];
        let period: u64 = 30;
        subscription::create_subscription_plan<VtuberCoin>(&biuwu, prices, period);
        scripts::update_tier<VtuberCoin>(&account, 1);
        scripts::deposit<VtuberCoin>(&account, 1000);
        timestamp::update_global_time_for_test(timestamp::now_microseconds() + 10);
        assert!(subscription::is_active<VtuberCoin>(account_addr), 1000);
        timestamp::update_global_time_for_test(timestamp::now_microseconds() + 30);
        assert!(!subscription::is_active<VtuberCoin>(account_addr), 1001);
    }
}
