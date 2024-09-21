#[test_only]
module biuwu::battles_tests {
    use std::signer;

    use aptos_framework::coin;
    use aptos_framework::managed_coin;

    use biuwu::battles;
    use biuwu::biuwu_coin::{Self, BiUwU};
    use biuwu::scripts;

    #[test(
        account = @0xdead, biuwu = @biuwu, idol_0 = @0xaa, idol_1 = @0xbb
    )]
    public entry fun test_end_to_end(
        account: signer,
        biuwu: signer,
        idol_0: signer,
        idol_1: signer
    ) {
        let account_addr = signer::address_of(&account);
        let biuwu_addr = signer::address_of(&biuwu);
        let idol_0_addr = signer::address_of(&idol_0);
        let idol_1_addr = signer::address_of(&idol_1);
        aptos_framework::account::create_account_for_test(account_addr);
        aptos_framework::account::create_account_for_test(biuwu_addr);
        aptos_framework::account::create_account_for_test(idol_0_addr);
        aptos_framework::account::create_account_for_test(idol_1_addr);

        biuwu_coin::initialize(&biuwu);
        coin::register<BiUwU>(&account);
        coin::register<BiUwU>(&idol_0);
        coin::register<BiUwU>(&idol_1);
        managed_coin::mint<BiUwU>(&biuwu, account_addr, 1000);

        battles::initialize(&biuwu);
        battles::start_battle(idol_0_addr, idol_1_addr);

        scripts::donate(&account, 0, false, 600);
        scripts::donate(&account, 0, true, 400);
        battles::stop_battle(&biuwu, 0);
        assert!(coin::balance<BiUwU>(idol_0_addr) == 1000, 1002);
    }
}
