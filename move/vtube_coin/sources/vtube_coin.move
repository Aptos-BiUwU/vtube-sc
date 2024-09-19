/// @notice Provides a function for creating coin
module vtube_coin::vtube_coin {
    use std::signer;
    use std::string::String;

    use aptos_framework::managed_coin::{Self, Capabilities};

    struct VtubeCoin {}

    public entry fun create_coin(
        caller: &signer,
        name: vector<u8>,
        symbol: vector<u8>,
        total_supply: u64
    ) {
        managed_coin::initialize<VtubeCoin>(
            caller,
            name,
            symbol,
            6,
            false
        );
    }

    public entry fun mint(caller: &signer, dst_addr: address, amount: u64) acquires Capabilities {
        managed_coin::mint<VtubeCoin>(caller, dst_addr, amount);
    }
}
