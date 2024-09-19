module biuwu::scripts {
    use std::signer;

    use aptos_framework::coin;

    use biuwu::subscription;
    use biuwu::biuwu_coin::{BiUwU};
    use biuwu::battle;

    public entry fun deposit<CoinType>(caller: &signer, value: u64) {
        let biuwu_coin = coin::withdraw<BiUwU>(caller, value);
        subscription::deposit<CoinType>(signer::address_of(caller), biuwu_coin);
    }

    public entry fun update_tier<CoinType>(caller: &signer, new_tier: u64) {
        subscription::update_tier<CoinType>(signer::address_of(caller), new_tier);
    }

    public entry fun donate(
        caller: &signer,
        vault_id: u64,
        side: bool,
        value: u64
    ) {
        let biuwu_coin = coin::withdraw<BiUwU>(caller, value);
        battle::donate(vault_id, side, biuwu_coin);
    }

    #[view]
    public fun is_active<CoinType>(dst_addr: address): bool {
        subscription::is_active<CoinType>(dst_addr)
    }
}
