 // solhint-disable-next-line compiler-fixed, compiler-gt-0_4
pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./libs/Manageable.sol";


contract WeBuildWord is Manageable, Ownable {

    using SafeMath for uint256;	

    enum BrickStatus { Inactive, Active, Completed, Cancelled }

    struct Builder {
        address builderAddress;
        string name;
    }
    
    struct Brick {
        string title;
        string url;
        string description;
        address owner;
        BrickStatus status;
        uint value;
        uint dateCreated;
        uint dateCompleted;
        address winner;
    }

    modifier onlyBrickOwner(uint _brickId) {
        require(bricks[_brickId].owner == msg.sender);
        _;
    }

    uint public brickId = 1000000;
    mapping (uint => Brick) public bricks;
    string public constant VERSION = "0.1";
    uint[] public brickIds;

    function () public payable {
        revert();
    }

    function getBrickIds() external view returns(uint[]) {
        return brickIds;
    }

    function addBrick(string _title, string _url, string _description) 
        public payable
        returns (uint id)
    {
        // greater than 0.01 eth
        require(msg.value > 10 ** 16);
        Brick memory brick = Brick({
            title: _title,
            url: _url,
            description: _description,
            owner: msg.sender,
            status: BrickStatus.Active,
            value: msg.value,
            // solhint-disable-next-line 
            dateCreated: now,
            dateCompleted: 0,
            winner: address(0x0)
        });
        id = getBrickId();
        brickIds.push(id);
        bricks[brickId] = brick;
    }

    function changeBrick(uint _brickId, string _title, string _url, string _description) 
        public onlyBrickOwner(_brickId) payable
        returns (bool success) 
    {
        require(bricks[_brickId].status == BrickStatus.Active);

        bricks[_brickId].title = _title;
        bricks[_brickId].url = _url;
        bricks[_brickId].description = _description;

        // Add to the fund.
        if (msg.value > 0) {
            bricks[_brickId].value += msg.value;
        }

        return true;
    }

    // msg.value is tip.
    function accept(uint _brickId, address _builderAddress) 
        public onlyBrickOwner(_brickId) 
        payable
        returns (bool success) 
    {
        require(bricks[_brickId].status == BrickStatus.Active);
        // disallow to take to your own.
        require(_builderAddress != msg.sender);

        bricks[_brickId].status = BrickStatus.Completed;
        bricks[_brickId].winner = _builderAddress;
        // solhint-disable-next-line
        bricks[_brickId].dateCompleted = now;

        if (msg.value > 0) {
            bricks[_brickId].value += msg.value;
        }

        _builderAddress.transfer(bricks[_brickId].value);
        return true;
    }

    function cancel(uint _brickId) 
        public onlyBrickOwner(_brickId) 
        returns (bool success) 
    {
        require(bricks[_brickId].status != BrickStatus.Completed);
        require(bricks[_brickId].status != BrickStatus.Cancelled);

        bricks[_brickId].status = BrickStatus.Cancelled;
        msg.sender.transfer(bricks[_brickId].value);

        return true;
    }

    function resetBrickIdTo(uint _start) 
        public onlyOwner returns (uint) 
    {
        brickId = _start;
        return brickId;
    }      

    function getBrickId() private returns (uint) {
        return brickId++;
    }  
}
