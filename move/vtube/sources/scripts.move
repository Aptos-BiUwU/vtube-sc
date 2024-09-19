module vtube::scripts {
    use std::signer;

    use aptos_framework::coin;

    use vtube::subscription;
    use vtube::protocol_coin::{BiUwU};

    public entry fun create_subscription_plan<CoinType>(
        caller: &signer, prices: vector<u64>, period: u64
    ) {
        subscription::create_subscription_plan<CoinType>(caller, prices, period);
    }

    public entry fun deposit<CoinType>(caller: &signer, value: u64) {
        let coin = coin::withdraw<BiUwU>(caller, value);
        subscription::deposit<CoinType>(caller, coin);
    }

    public entry fun update_tier<CoinType>(caller: &signer, new_tier: u64) {
        subscription::update_tier<CoinType>(caller, new_tier);
    }

    #[view]
    public entry fun is_active<CoinType>(caller: &signer): bool {
        subscription::is_active<CoinType>(signer::address_of(caller))
    }
}
