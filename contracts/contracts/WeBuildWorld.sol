 // solhint-disable-next-line compiler-fixed, compiler-gt-0_4
pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
// import "zeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "./libs/Extendable.sol";
import "./Provider.sol";


contract WeBuildWord is Extendable {
    string private constant PROVIDER = "PROVIDER";
    string public constant VERSION = "0.1";
    uint public constant DONAMITOR = 10000;
    
    Provider provider;

    modifier onlyBrickOwner(uint _brickId) {
        require(provider.isBrickOwner(_brickId, msg.sender));
        _;
    }

    function () public payable {
        revert();
    }

    function getBrickIds() public view returns(uint[]) {
        return provider.getBrickIds();
    }

    function addBrick(string _title, string _url, string _description) 
        public payable
        returns (uint id)
    {
        id = provider.addBrick(_title, _url, _description, msg.value);
    }

    function changeBrick(uint _brickId, string _title, string _url, string _description) 
        public onlyBrickOwner(_brickId) payable
        returns (bool success) 
    {
        return provider.changeBrick(_brickId, _title, _url, _description, msg.value);
    }

    // msg.value is tip.
    function accept(uint _brickId, address[] _winners, uint[] _weights) 
        public onlyBrickOwner(_brickId) 
        payable
        returns (bool success) 
    {
        uint total = provider.accept(_brickId, _winners, _weights, msg.value);
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
        uint value = provider.cancel(_brickId);
        require(value > 0);

        msg.sender.transfer(value);  
        return true;      
    }

    function resetBrickIdTo(uint _start) 
        public onlyOwner returns (uint) 
    {
        return provider.resetBrickIdTo(_start);
    }      

    function startWork(uint _brickId, string _builderId, string _nickName) 
        public returns(bool success)
    {
        return provider.startWork(_brickId, _builderId, _nickName);    
    }
}
