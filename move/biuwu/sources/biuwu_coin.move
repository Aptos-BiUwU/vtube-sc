module biuwu::biuwu_coin {
    use std::signer;

    use aptos_framework::managed_coin;

    /// @notice Error code for unauthorized caller
    const ERR_UNAUTHORIZED_CALLER: u64 = 1;

    struct BiUwU {}

    public entry fun create_coin(caller: &signer) {
        check_admin(caller);

        managed_coin::initialize<BiUwU>(
            caller,
            b"BiUwU",
            b"BUU",
            6,
            false
        );
        managed_coin::register<BiUwU>(caller);
    }

    fun check_admin(caller: &signer) {
        assert!(signer::address_of(caller) == @biuwu, ERR_UNAUTHORIZED_CALLER);
    }
}
