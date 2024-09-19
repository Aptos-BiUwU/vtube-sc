#[test_only]
module vtube::subscription_tests {
    use std::signer;

    use aptos_framework::coin;
    use aptos_framework::managed_coin;
    use aptos_framework::timestamp;

    use vtube::test_coins::{Self, VtubeCoin};
    use vtube::subscription;
    use vtube::protocol_coin::{Self, BiUwU};
    use vtube::scripts;

    #[test(account = @0xdead, framework = @0x1, vtube = @vtube)]
    public entry fun test_end_to_end(
        account: signer, framework: signer, vtube: signer
    ) {
        timestamp::set_time_has_started_for_testing(&framework);
        let account_addr = signer::address_of(&account);
        let vtube_addr = signer::address_of(&vtube);
        aptos_framework::account::create_account_for_test(account_addr);
        aptos_framework::account::create_account_for_test(vtube_addr);

        test_coins::create_coin(&vtube);
        protocol_coin::create_coin(&vtube);
        coin::register<VtubeCoin>(&account);
        coin::register<BiUwU>(&account);
        managed_coin::mint<VtubeCoin>(&vtube, account_addr, 1000);
        managed_coin::mint<BiUwU>(&vtube, account_addr, 1000);

        let prices: vector<u64> = vector[0, 1000, 2000, 3000];
        let period: u64 = 30;
        subscription::create_subscription_plan<VtubeCoin>(&vtube, prices, period);
        scripts::update_tier<VtubeCoin>(&account, 1);
        scripts::deposit<VtubeCoin>(&account, 1000);
        timestamp::update_global_time_for_test(timestamp::now_microseconds() + 10);
        assert!(subscription::is_active<VtubeCoin>(account_addr), 1000);
        timestamp::update_global_time_for_test(timestamp::now_microseconds() + 30);
        assert!(!subscription::is_active<VtubeCoin>(account_addr), 1001);
    }
}
