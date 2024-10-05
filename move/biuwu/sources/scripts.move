module biuwu::scripts {
    use std::signer;

    use aptos_framework::coin;

    use biuwu::subscriptions;
    use biuwu::biuwu_coin::{BiUwU};
    use biuwu::battles;
    use biuwu::campaigns;

    public entry fun deposit<CoinType>(caller: &signer, amount: u64) {
        let biuwu_coin = coin::withdraw<BiUwU>(caller, amount);
        subscriptions::deposit<CoinType>(signer::address_of(caller), biuwu_coin);
    }

    public entry fun update_tier<CoinType>(caller: &signer, new_tier: u64) {
        subscriptions::update_tier<CoinType>(signer::address_of(caller), new_tier);
    }

    public entry fun attack(
        caller: &signer,
        battle_id: u64,
        side: bool,
        amount: u64
    ) {
        let biuwu_coin = coin::withdraw<BiUwU>(caller, amount);
        battles::attack(battle_id, side, biuwu_coin);
    }

    public entry fun donate(caller: &signer, campaign_id: u64, amount: u64) {
        let biuwu_coin = coin::withdraw<BiUwU>(caller, amount);
        campaigns::donate(campaign_id, signer::address_of(caller), biuwu_coin);
    }

    #[view]
    public fun is_active<CoinType>(dst_addr: address): bool {
        subscriptions::is_active<CoinType>(dst_addr)
    }

    #[view]
    public fun get_battle_info(battle_id: u64): (address, address, u64, u64) {
        battles::get_battle_info(battle_id)
    }

    #[view]
    public fun get_campaign_info(campaign_id: u64): (address, u64, u64) {
        campaigns::get_campaign_info(campaign_id)
    }

    #[view]
    public fun get_donation_info(campaign_id: u64, dst_addr: address): u64 {
        campaigns::get_donation_info(campaign_id, dst_addr)
    }

    #[view]
    public fun get_subscription_plan_info<CoinType>(): (vector<u64>, u64) {
        subscriptions::get_subscription_plan_info<CoinType>()
    }

    #[view]
    public fun get_subscription_info<CoinType>(dst_addr: address): (u64, u64, u64) {
        subscriptions::get_subscription_info<CoinType>(dst_addr)
    }
}
