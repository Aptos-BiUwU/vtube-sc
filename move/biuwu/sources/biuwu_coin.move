module biuwu::biuwu_coin {
    use aptos_framework::managed_coin;

    /// @notice Error code for unauthorized caller
    const ERR_UNAUTHORIZED_CALLER: u64 = 1;

    struct BiUwU {}

    public entry fun initialize(caller: &signer) {
        managed_coin::initialize<BiUwU>(
            caller,
            b"BiUwU",
            b"BUU",
            6,
            false
        );
        managed_coin::register<BiUwU>(caller);
    }
}
