module biuwu::battle {
    use std::vector;

    use aptos_framework::coin::{Self, Coin};

    use biuwu::biuwu_coin::{BiUwU};

    struct Vault has store {
        address_0: address,
        address_1: address,
        value_0: u64,
        value_1: u64
    }

    struct VaultManagement has key {
        vaults: vector<Vault>
    }

    public entry fun initialize(caller: &signer) {
        let vaults: vector<Vault> = vector[];
        let vault_management = VaultManagement { vaults };
        move_to(caller, vault_management);
    }

    public entry fun start_battle(address_0: address, address_1: address) acquires VaultManagement {
        let vault = Vault { address_0, address_1, value_0: 0, value_1: 0 };
        let vault_management = borrow_global_mut<VaultManagement>(@biuwu);
        vector::push_back(&mut vault_management.vaults, vault);
    }

    public fun donate(vault_id: u64, side: bool, biuwu_coin: Coin<BiUwU>) acquires VaultManagement {
        let vault_management = borrow_global_mut<VaultManagement>(@biuwu);
        let vault = vector::borrow_mut(&mut vault_management.vaults, vault_id);
        if (side) {
            vault.value_1 = vault.value_1 + coin::value(&biuwu_coin);
        } else {
            vault.value_0 = vault.value_0 + coin::value(&biuwu_coin);
        };
        coin::deposit(@biuwu, biuwu_coin);
    }

    public entry fun stop_battle(caller: &signer, vault_id: u64) acquires VaultManagement {
        let vault_management = borrow_global_mut<VaultManagement>(@biuwu);
        let vault = vector::borrow_mut(&mut vault_management.vaults, vault_id);
        if (vault.value_0 > vault.value_1) {
            coin::transfer<BiUwU>(caller, vault.address_0, vault.value_0
                + vault.value_1);
        } else {
            coin::transfer<BiUwU>(caller, vault.address_1, vault.value_1
                + vault.value_0);
        }
    }
}
