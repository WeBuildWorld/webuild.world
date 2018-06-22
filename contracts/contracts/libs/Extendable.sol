pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract Extendable is Ownable {
    mapping (string => address) providers;

    function setProvider(string _id, address _address) 
        public onlyOwner returns (bool) 
    {
        require(_address != 0x0);
        providers[_id] = _address;

        return true;
    }

    function getProvider(string _id) public view returns (address) 
    {
        return providers[_id];
    }
}
