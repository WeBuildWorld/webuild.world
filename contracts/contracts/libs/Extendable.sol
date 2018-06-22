pragma solidity 0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract Extendable is Ownable {
    struct ProviderItem {
        uint start;
        uint end;
        address providerAddress;
    }

    uint public currentId = 10000;
    uint16 public currentVersion = 0;
    mapping (uint => ProviderItem) internal providers;

    function upgradeProvider(address _address) 
        public onlyOwner returns (bool) 
    {
        require(_address != 0x0);

        // first time
        if (providers[currentVersion].providerAddress == 0x0) {
            providers[currentVersion].start = currentId;
            providers[currentVersion].end = 10 ** 18;
            providers[currentVersion].providerAddress = _address;
            return true;            
        }

        providers[currentVersion].end = currentId;

        ProviderItem memory newProvider = ProviderItem({
            start: currentId++,
            end: 10**18,
            providerAddress: _address
        });

        providers[getVersion()] = newProvider;

        return true;
    }

    function getProviderDetails(uint _version) public view returns (uint _start, uint _end, address _address) 
    {
        ProviderItem memory provider = providers[_version];
        return (provider.start, provider.end, provider.providerAddress);
    }

    function getProviderById(uint _id) public view returns (address) {
        for (uint i = currentVersion; i > 0; i--) {
            ProviderItem memory item = providers[i];
            if (item.start <= _id && item.end > _id) {
                return item.providerAddress;
            }
        }

        return getCurrentProvider();
    }

    function getCurrentProvider() public view returns(address) {
        return providers[currentVersion].providerAddress;
    }   

    function getAllProviders() public view returns (address[] memory addresses) {
        addresses = new address[](currentVersion + 1);
        for (uint i=0; i < currentVersion; i++) {
            addresses[i] = providers[i].providerAddress;
        }

        return addresses;
    }

    function getVersion() private returns (uint) {
        return currentVersion++;
    }
}
