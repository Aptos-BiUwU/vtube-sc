module biuwu::battles {
    use std::vector;

    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::event;

    use biuwu::biuwu_coin::{BiUwU};

    struct Vault has store {
        address_0: address,
        address_1: address,
        reserve_0: u64,
        reserve_1: u64
    }

    struct VaultManagement has key {
        vaults: vector<Vault>
    }

    #[event]
    struct BattleStarted has drop, store {
        address_0: address,
        address_1: address,
        vault_id: u64
    }

    #[event]
    struct Donation has drop, store {
        vault_id: u64,
        side: bool,
        amount: u64
    }

    #[event]
    struct BattleStopped has drop, store {
        vault_id: u64,
        winner: address,
        prize: u64
    }

    public entry fun initialize(caller: &signer) {
        let vaults: vector<Vault> = vector[];
        let vault_management = VaultManagement { vaults };
        move_to(caller, vault_management);
    }

    public entry fun start_battle(address_0: address, address_1: address) acquires VaultManagement {
        let vault = Vault { address_0, address_1, reserve_0: 0, reserve_1: 0 };
        let vault_management = borrow_global_mut<VaultManagement>(@biuwu);
        vector::push_back(&mut vault_management.vaults, vault);

        event::emit(
            BattleStarted { address_0, address_1, vault_id: vector::length(&vault_management.vaults) - 1 }
        );
    }

    public fun donate(vault_id: u64, side: bool, biuwu_coin: Coin<BiUwU>) acquires VaultManagement {
        let vault_management = borrow_global_mut<VaultManagement>(@biuwu);
        let vault = vector::borrow_mut(&mut vault_management.vaults, vault_id);
        let amount = coin::value(&biuwu_coin);
        if (side) {
            vault.reserve_1 = vault.reserve_1 + amount;
        } else {
            vault.reserve_0 = vault.reserve_0 + amount;
        };
        coin::deposit(@biuwu, biuwu_coin);

        event::emit(
            Donation { vault_id, side, amount }
        );
    }

    public entry fun stop_battle(caller: &signer, vault_id: u64) acquires VaultManagement {
        let vault_management = borrow_global_mut<VaultManagement>(@biuwu);
        let vault = vector::borrow_mut(&mut vault_management.vaults, vault_id);
        
        let winner = if (vault.reserve_0 > vault.reserve_1) {
            vault.address_0
        } else {
            vault.address_1
        };
        let prize = vault.reserve_0 + vault.reserve_1;

        coin::transfer<BiUwU> (caller, winner, prize);
        vault.reserve_0 = 0;
        vault.reserve_1 = 0;

        event::emit(
            BattleStopped { vault_id, winner, prize }
        );
    }
}
