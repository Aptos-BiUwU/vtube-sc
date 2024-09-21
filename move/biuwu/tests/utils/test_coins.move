#[test_only]
module biuwu::test_coins {
    use aptos_framework::managed_coin;
    
    use biuwu::biuwu_coin::BiUwU;

    struct VtuberCoin {}

    public entry fun create_coin(account: &signer) {
        managed_coin::initialize<VtuberCoin>(
            account,
            b"VtuberCoin",
            b"VTC",
            6,
            false
        );
        managed_coin::register<VtuberCoin>(account);
    }
}
