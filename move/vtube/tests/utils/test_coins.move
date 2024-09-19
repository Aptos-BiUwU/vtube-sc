#[test_only]
module vtube::test_coins {
    use aptos_framework::managed_coin;

    struct VtubeCoin {}

    public entry fun create_coin(account: &signer) {
        managed_coin::initialize<VtubeCoin>(
            account,
            b"VtubeCoin",
            b"VTC",
            6,
            false
        );
    }
}
