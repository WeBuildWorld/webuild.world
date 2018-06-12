pragma solidity ^0.4.18;

import "./Manageable.sol";

library TypeDefinitions {
    enum ProviderType {
        Storage,
        ExtendedStorage,
        Whitelist
    }
}

contract Provider is Manageable {
    string public name;
    TypeDefinitions.ProviderType public providerType;
    string public description;
}
