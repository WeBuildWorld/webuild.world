pragma solidity ^0.4.23;

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

    constructor() public {
        providers[currentVersion].start = currentId;
        providers[currentVersion].end = 10 ** 18;
        providers[currentVersion].providerAddress = 0x0;
    }

    function upgradeProvider(address _address) 
        public onlyOwner returns (bool) 
    {
        require(_address != 0x0);
        providers[currentVersion].end = currentId;

        ProviderItem memory newProvider = ProviderItem({
            start: currentId ++,
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

    function getCurrentProvider() public view returns(address) {
        return providers[currentVersion].providerAddress;
    }   

    function getVersion() private returns (uint) {
        return currentVersion++;
    }
}
