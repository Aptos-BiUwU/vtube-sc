module biuwu::battles {
    use std::vector;

    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::event;

    use biuwu::biuwu_coin::{BiUwU};

    struct Battle has store {
        address_0: address,
        address_1: address,
        reserve_0: u64,
        reserve_1: u64
    }

    struct BattleManagement has key {
        battles: vector<Battle>
    }

    #[event]
    struct BattleStarted has drop, store {
        address_0: address,
        address_1: address,
        battle_id: u64
    }

    #[event]
    struct AttackPerformed has drop, store {
        battle_id: u64,
        side: bool,
        amount: u64
    }

    #[event]
    struct BattleStopped has drop, store {
        battle_id: u64,
        winner: address,
        prize: u64
    }

    public entry fun initialize(caller: &signer) {
        let battles: vector<Battle> = vector[];
        let battle_management = BattleManagement { battles };
        move_to(caller, battle_management);
    }

    public entry fun start_battle(address_0: address, address_1: address) acquires BattleManagement {
        let battle = Battle { address_0, address_1, reserve_0: 0, reserve_1: 0 };
        let battle_management = borrow_global_mut<BattleManagement>(@biuwu);
        vector::push_back(&mut battle_management.battles, battle);

        event::emit(
            BattleStarted {
                address_0,
                address_1,
                battle_id: vector::length(&battle_management.battles) - 1
            }
        );
    }

    public fun attack(battle_id: u64, side: bool, biuwu_coin: Coin<BiUwU>) acquires BattleManagement {
        let battle_management = borrow_global_mut<BattleManagement>(@biuwu);
        let battle = vector::borrow_mut(&mut battle_management.battles, battle_id);
        let amount = coin::value(&biuwu_coin);
        if (side) {
            battle.reserve_1 = battle.reserve_1 + amount;
        } else {
            battle.reserve_0 = battle.reserve_0 + amount;
        };
        coin::deposit(@biuwu, biuwu_coin);

        event::emit(AttackPerformed { battle_id, side, amount });
    }

    public entry fun stop_battle(caller: &signer, battle_id: u64) acquires BattleManagement {
        let battle_management = borrow_global_mut<BattleManagement>(@biuwu);
        let battle = vector::borrow_mut(&mut battle_management.battles, battle_id);

        let winner =
            if (battle.reserve_0 > battle.reserve_1) {
                battle.address_0
            } else {
                battle.address_1
            };
        let prize = battle.reserve_0 + battle.reserve_1;

        coin::transfer<BiUwU>(caller, winner, prize);
        battle.reserve_0 = 0;
        battle.reserve_1 = 0;

        event::emit(BattleStopped { battle_id, winner, prize });
    }

    #[view]
    public fun get_battle_info(battle_id: u64): (address, address, u64, u64) acquires BattleManagement {
        let battle_management = borrow_global_mut<BattleManagement>(@biuwu);
        let battle = vector::borrow_mut(&mut battle_management.battles, battle_id);
        (battle.address_0, battle.address_1, battle.reserve_0, battle.reserve_1)
    }
}
