module biuwu::campaigns {
    use std::vector;

    use aptos_framework::event;
    use aptos_framework::coin::{Self, Coin};

    use aptos_std::table::{Self, Table};

    use biuwu::biuwu_coin::{BiUwU};

    struct Campaign has store {
        coin_addr: address,
        current: u64,
        target: u64,
        donations: Table<address, u64>
    }

    struct CampaignManagement has key {
        campaigns: vector<Campaign>
    }

    #[event]
    struct CampaignStarted has drop, store {
        coin_addr: address,
        target: u64,
        campaign_id: u64
    }

    #[event]
    struct DonationReceived has drop, store {
        campaign_id: u64,
        dst_addr: address,
        amount: u64
    }

    public entry fun initialize(caller: &signer) {
        let campaigns: vector<Campaign> = vector[];
        let campaign_management = CampaignManagement { campaigns };
        move_to(caller, campaign_management);
    }

    public entry fun start_campaign(
        caller: &signer, coin_addr: address, target: u64
    ) acquires CampaignManagement {
        let campaign = Campaign {
            coin_addr,
            current: 0,
            target,
            donations: table::new<address, u64>()
        };
        let campaign_management = borrow_global_mut<CampaignManagement>(@biuwu);
        vector::push_back(&mut campaign_management.campaigns, campaign);

        event::emit(
            CampaignStarted{
                coin_addr,
                target,
                campaign_id: vector::length(&campaign_management.campaigns) - 1
            }
        );
    }

    public fun donate(
        campaign_id: u64, dst_addr: address, biuwu_coin: Coin<BiUwU>
    ) acquires CampaignManagement {
        let campaign_management = borrow_global_mut<CampaignManagement>(@biuwu);
        let campaign = vector::borrow_mut(&mut campaign_management.campaigns, campaign_id);
        let balance = table::borrow_mut_with_default(&mut campaign.donations, dst_addr, 0);
        let amount = coin::value(&biuwu_coin);
        campaign.current = campaign.current + amount;
        *balance = *balance + amount;
        coin::deposit(@biuwu, biuwu_coin);

        event::emit(DonationReceived { campaign_id, dst_addr, amount });
    }

    #[view]
    public fun get_campaign_info(campaign_id: u64): (address, u64, u64) acquires CampaignManagement {
        let campaign_management = borrow_global_mut<CampaignManagement>(@biuwu);
        let campaign = vector::borrow_mut(
            &mut campaign_management.campaigns, campaign_id
        );
        (campaign.coin_addr, campaign.current, campaign.target)
    }

    #[view]
    public fun get_donation_info(
        campaign_id: u64, dst_addr: address
    ): u64 acquires CampaignManagement {
        let campaign_management = borrow_global_mut<CampaignManagement>(@biuwu);
        let campaign = vector::borrow_mut(
            &mut campaign_management.campaigns, campaign_id
        );
        *table::borrow_with_default(&campaign.donations, dst_addr, &0)
    }
}
