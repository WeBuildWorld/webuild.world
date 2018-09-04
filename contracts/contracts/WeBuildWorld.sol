 // solhint-disable-next-line compiler-fixed, compiler-gt-0_4
pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./libs/Extendable.sol";
import "./Provider.sol";


contract WeBuildWorld is Extendable {
    using SafeMath for uint256;

    string public constant VERSION = "0.1";
    uint public constant DENOMINATOR = 10000;
    enum AddressRole { Owner, Builder }


    modifier onlyBrickOwner(uint _brickId) {
        require(getProvider(_brickId).isBrickOwner(_brickId, msg.sender));
        _;
    }

    event BrickAdded (uint _brickId);
    event BrickUpdated (uint _brickId);
    event BrickCancelled (uint _brickId);
    event WorkStarted (uint _brickId, address _builderAddress);
    event WorkAccepted (uint _brickId, address[] _winners);
 
    function () public payable {
        revert();
    }

    function getBrickIdsByOwner(address _owner) public view returns(uint[] brickIds) {
        return _getBrickIdsByAddress(_owner, AddressRole.Owner);
    }

    function getBrickIdsByBuilder(address _builder) public view returns(uint[] brickIds) {
        return _getBrickIdsByAddress(_builder, AddressRole.Builder);
    }
 
    function _getBrickIdsByAddress(
        address _address,
        AddressRole role
      ) 
        private view returns(uint[] brickIds) { 
        address[] memory providers = getAllProviders();
        uint[] memory temp; 
        uint total = 0;
        uint index = 0; 

        for (uint i = providers.length; i > 0; i--) {
            Provider provider = Provider(providers[i-1]);
            total = total + provider.getBrickSize();  
        }

        brickIds = new uint[](total);  
    
        for(i = 0; i < providers.length; i++){
            temp = provider.getBrickIds();
            for (uint j = 0; j < temp.length; j++) {
                bool cond = true;
                if(role == AddressRole.Owner){
                    cond = provider.isBrickOwner(temp[j], _address);
                }else{
                    cond = provider.participated(temp[j], _address);
                } 
                if(cond){
                    brickIds[index] = temp[j]; 
                    index++;
                }
            }
        }

        return brickIds;
    }

    function getBrickIds(
        uint _skip,
        uint _take,
        bytes32[] _tags, 
        uint _status, 
        uint _started, 
        uint _expired
        ) 
        public view returns(uint[] brickIds) {

        address[] memory providers = getAllProviders();
        uint[] memory temp;

        brickIds = new uint[](_take);
        uint counter = 0; 
        uint taken = 0;

        for (uint i = providers.length; i > 0; i--) {
            if (taken >= _take) {
                break;
            }

            Provider provider = Provider(providers[i-1]);
            temp = provider.getBrickIds();
            
            for (uint j = 0; j < temp.length; j++) { 
                if (taken >= _take) {
                    break;
                }
                
                bool exist = provider.filterBrick(temp[j], _tags, _status, _started, _expired);
                if(exist){
                    if (counter >= _skip) { 
                        brickIds[taken] = temp[j];                     
                        taken++;
                    }
                    counter++;
                }
            }
        }

        return brickIds;
    }

    function addBrick(string _title, string _url, uint _expired, string _description, bytes32[] _tags) 
        public payable
        returns (uint id)
    {
        id = getId();
        require(getProvider(id).addBrick(id, _title, _url, _expired, _description, _tags, msg.value));
        emit BrickAdded(id);
    }

    function changeBrick(uint _brickId, string _title, string _url, string _description, bytes32[] _tags) 
        public onlyBrickOwner(_brickId) payable
        returns (bool success) 
    {
        success = getProvider(_brickId).changeBrick(_brickId, _title, _url, _description, _tags, msg.value);
        emit BrickUpdated(_brickId);

        return success;
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
            _winners[i].transfer(total.mul(_weights[i]).div(DENOMINATOR));    
        }     

        emit WorkAccepted(_brickId, _winners);
        return true;   
    }

    function cancel(uint _brickId) 
        public onlyBrickOwner(_brickId) 
        returns (bool success) 
    {
        uint value = getProvider(_brickId).cancel(_brickId);
        require(value > 0);

        msg.sender.transfer(value);  
        emit BrickCancelled(_brickId);
        return true;      
    }    

    function startWork(uint _brickId, bytes32 _builderId, bytes32 _nickName) 
        public returns(bool success)
    {
        success = getProvider(_brickId).startWork(_brickId, _builderId, _nickName, msg.sender);    
        emit WorkStarted(_brickId, msg.sender);
    }

    function getBrick(uint _brickId) public view returns (
        string title,
        string url,
        address owner,
        uint value,
        uint dateCreated,
        uint dateCompleted,
        uint expired,
        uint status
    ) {
        return getProvider(_brickId).getBrick(_brickId);
    }

    function getBrickDetail(uint _brickId) public view returns (
        bytes32[] tags,
        string description,
        uint32 builders,
        address[] winners        
    ) {
        return getProvider(_brickId).getBrickDetail(_brickId);
    }

    function getBrickBuilders(uint _brickId) public view returns (
        address[] addresses,
        uint[] dates,
        bytes32[] keys,
        bytes32[] names
    )
    {
        return getProvider(_brickId).getBrickBuilders(_brickId);
    }

    function getProvider(uint _brickId) private view returns (Provider) {
        return Provider(getProviderById(_brickId));
    }

    function getId() private returns (uint) {
        return currentId++;
    }      
}
