module biuwu::scripts {
    use std::signer;

    use aptos_framework::coin;

    use biuwu::subscriptions;
    use biuwu::biuwu_coin::{BiUwU};
    use biuwu::battles;

    public entry fun deposit<CoinType>(caller: &signer, amount: u64) {
        let biuwu_coin = coin::withdraw<BiUwU>(caller, amount);
        subscriptions::deposit<CoinType>(signer::address_of(caller), biuwu_coin);
    }

    public entry fun update_tier<CoinType>(caller: &signer, new_tier: u64) {
        subscriptions::update_tier<CoinType>(signer::address_of(caller), new_tier);
    }

    public entry fun donate(
        caller: &signer,
        vault_id: u64,
        side: bool,
        amount: u64
    ) {
        let biuwu_coin = coin::withdraw<BiUwU>(caller, amount);
        battles::donate(vault_id, side, biuwu_coin);
    }

    #[view]
    public fun is_active<CoinType>(dst_addr: address): bool {
        subscriptions::is_active<CoinType>(dst_addr)
    }
}
