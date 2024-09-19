#[test_only]
module vtube::battle_tests {
    use std::signer;

    use aptos_framework::coin;
    use aptos_framework::managed_coin;

    use vtube::battle;
    use vtube::protocol_coin::{Self, BiUwU};
    use vtube::scripts;

    #[test(
        account = @0xdead, vtube = @vtube, idol_0 = @0xaa, idol_1 = @0xbb
    )]
    public entry fun test_end_to_end(
        account: signer, vtube: signer, idol_0: signer, idol_1: signer
    ) {
        let account_addr = signer::address_of(&account);
        let vtube_addr = signer::address_of(&vtube);
        let idol_0_addr = signer::address_of(&idol_0);
        let idol_1_addr = signer::address_of(&idol_1);
        aptos_framework::account::create_account_for_test(account_addr);
        aptos_framework::account::create_account_for_test(vtube_addr);
        aptos_framework::account::create_account_for_test(idol_0_addr);
        aptos_framework::account::create_account_for_test(idol_1_addr);

        protocol_coin::create_coin(&vtube);
        coin::register<BiUwU>(&account);
        coin::register<BiUwU>(&idol_0);
        coin::register<BiUwU>(&idol_1);
        managed_coin::mint<BiUwU>(&vtube, account_addr, 1000);

        battle::initialize(&vtube);
        battle::start_battle(idol_0_addr, idol_1_addr);
        
        scripts::donate(&account, 0, false, 600);
        scripts::donate(&account, 0, true, 400);
        battle::stop_battle(&vtube, 0);
        assert!(coin::balance<BiUwU>(idol_0_addr) == 1000, 1002);
    }
}
