 // solhint-disable-next-line compiler-fixed, compiler-gt-0_4
pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./libs/Extendable.sol";
import "./Provider.sol";


contract WeBuildWord is Extendable {
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

    function getBrickIds(uint _skip, uint _take) public view returns(uint[] brickIds) {
        address[] memory providers = getAllProviders();
        uint[] memory temp;
        brickIds = new uint[](_take);
        uint length = 0; 
        uint count = 0;

        for (uint i = 0; i < providers.length; i++) {
            Provider provider = Provider(providers[i]);
            temp = provider.getBrickIds();
            
            for (uint j = 0; j < temp.length; j++) {
                if (count >= _take) {
                    break;
                }
                if (length >= _skip && count <= _take) {
                    brickIds[length++] = temp[j];
                    count++;
                }
            }
        }

        return brickIds;
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

    function getBrick(uint _brickId) public view returns (
        string title,
        string url,
        string description,
        address owner,
        uint value,
        uint dateCreated,
        uint dateCompleted,
        uint32 builders,
        uint32 status,
        address[] winners        
    ) {
        return getProvider(_brickId).getBrick(_brickId);
    }

    function getProvider(uint _brickId) private view returns (Provider) {
        return Provider(getProviderById(_brickId));
    }

    function getId() private returns (uint) {
        return currentId++;
    }      
}
