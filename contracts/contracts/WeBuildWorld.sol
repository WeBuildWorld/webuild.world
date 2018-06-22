 // solhint-disable-next-line compiler-fixed, compiler-gt-0_4
pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "solidity-array-utils/contracts/AddressArrayUtils.sol";
import "solidity-array-utils/contracts/UIntArrayUtils.sol";
// import "zeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "./libs/Extendable.sol";
import "./Provider.sol";


contract WeBuildWord is Extendable {
    using AddressArrayUtils for address[];
    using UIntArrayUtils for uint[];
    using SafeMath for uint256;	

    string public constant VERSION = "0.1";
    uint public constant DONAMITOR = 10000;
    
    modifier onlyBrickOwner(uint _brickId) {
        require(getProvider(_brickId).isBrickOwner(_brickId, msg.sender));
        _;
    }

    function () public payable {
        revert();
    }

    function getBrickIds() public view returns(uint[] brickIds) {
        address[] memory providers = getAllProviders();
        uint[] memory temp;
        uint length = 0;
        for (uint i = 0; i < providers.length; i++) {
            Provider provider = Provider(providers[i]);
            temp = provider.getBrickIds();
            
            for (uint j = 0; j < temp.length; j++) {
                brickIds[length++] = temp[j];
            }
        }
    }

    function addBrick(string _title, string _url, string _description) 
        public payable
        returns (uint id)
    {
        id = getId();
        require(getProvider(id).addBrick(id, _title, _url, _description, msg.value));
    }

    function changeBrick(uint _brickId, string _title, string _url, string _description) 
        public onlyBrickOwner(_brickId) payable
        returns (bool success) 
    {
        return getProvider(_brickId).changeBrick(_brickId, _title, _url, _description, msg.value);
    }

    // msg.value is tip.
    function accept(uint _brickId, address[] _winners, uint[] _weights) 
        public onlyBrickOwner(_brickId) 
        payable
        returns (bool success) 
    {
        uint total = getProvider(_brickId).accept(_brickId, _winners, _weights, msg.value);
        require(total > 0);
        for (uint i=0; i < _winners.length; i++) {
            _winners[i].transfer(total * _weights[i] / DONAMITOR);    
        }     

        return true;   
    }

    function cancel(uint _brickId) 
        public onlyBrickOwner(_brickId) 
        returns (bool success) 
    {
        uint value = getProvider(_brickId).cancel(_brickId);
        require(value > 0);

        msg.sender.transfer(value);  
        return true;      
    }    

    function startWork(uint _brickId, string _builderId, string _nickName) 
        public returns(bool success)
    {
        return getProvider(_brickId).startWork(_brickId, _builderId, _nickName);    
    }

    function getProvider(uint _brickId) private view returns (Provider) {
        return Provider(getProviderById(_brickId));
    }

    function getId() private returns (uint) {
        return currentId++;
    }      
}
