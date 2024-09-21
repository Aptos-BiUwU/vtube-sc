/// @notice Provides a function for creating coin
module vtuber_coin::vtuber_coin {
    use std::signer;
    use std::string::String;

    use aptos_framework::managed_coin::{Self, Capabilities};

    struct VtuberCoin {}

    public entry fun initialize(
        caller: &signer, name: vector<u8>, symbol: vector<u8>
    ) {
        managed_coin::initialize<VtuberCoin>(
            caller,
            name,
            symbol,
            6,
            false
        );
    }
}
