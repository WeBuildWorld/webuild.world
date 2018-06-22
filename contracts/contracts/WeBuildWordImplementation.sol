 // solhint-disable-next-line compiler-fixed, compiler-gt-0_4
pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
// import "zeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "./Provider.sol";


contract WeBuildWordImplementation is Ownable, Provider {
    using SafeMath for uint256;	

    enum BrickStatus { Inactive, Active, Completed, Cancelled }

    struct Builder {
        bool joined;
        string key;
        string nickName;
    }
    
    struct Brick {
        string title;
        string url;
        string description;
        address owner;
        uint value;
        uint dateCreated;
        uint dateCompleted;
        uint32 builders;
        address[] winners;
        BrickStatus status;
    }

    address public main = 0x0;
    uint public brickId = 1000000;
    mapping (uint => Brick) public bricks;
    mapping(uint => mapping(address => Builder)) public brickBuilders;

    string public constant VERSION = "0.1";
    uint[] public brickIds;

    modifier onlyMain() {
        require(msg.sender == main);
        _;
    }

    function () public payable {
        revert();
    }    

    function isBrickOwner(uint _brickId, address _address) external returns (bool success) {
        return bricks[_brickId].owner == _address;
    }    

    function addBrick(uint _brickId, string _title, string _url, string _description, uint _value) 
        external onlyMain
        returns (bool success)
    {
        // greater than 0.01 eth
        require(_value > 10 ** 16);
        Brick memory brick = Brick({
            title: _title,
            url: _url,
            description: _description,
            // solhint-disable-next-line
            owner: tx.origin,
            status: BrickStatus.Active,
            value: _value,
            // solhint-disable-next-line 
            dateCreated: now,
            dateCompleted: 0,
            builders: 0,
            winners: new address[](0)
        });
        brickIds.push(_brickId);
        bricks[_brickId] = brick;

        return true;
    }

    function changeBrick(uint _brickId, string _title, string _url, string _description, uint _value) 
        external onlyMain
        returns (bool success) 
    {
        require(bricks[_brickId].status == BrickStatus.Active);

        bricks[_brickId].title = _title;
        bricks[_brickId].url = _url;
        bricks[_brickId].description = _description;

        // Add to the fund.
        if (_value > 0) {
            bricks[_brickId].value += _value;
        }

        return true;
    }

    // msg.value is tip.
    function accept(uint _brickId, address[] _winners, uint[] _weights, uint _value) 
        external onlyMain
        returns (uint) 
    {
        require(bricks[_brickId].status == BrickStatus.Active);
        require(_winners.length == _weights.length);
        // disallow to take to your own.

        uint total = 0;
        for (uint i = 0; i < _winners.length; i++) {
            // solhint-disable-next-line
            require(_winners[i] != tx.origin);
            require(brickBuilders[_brickId][_winners[i]].joined);
            total += _weights[i];
        }

        require(total <= 100);

        bricks[_brickId].status = BrickStatus.Completed;
        bricks[_brickId].winners = _winners;
        // solhint-disable-next-line
        bricks[_brickId].dateCompleted = now;

        if (_value > 0) {
            bricks[_brickId].value += _value;
        }

        return bricks[_brickId].value;
    }

    function cancel(uint _brickId) 
        external onlyMain
        returns (uint value) 
    {
        require(bricks[_brickId].status != BrickStatus.Completed);
        require(bricks[_brickId].status != BrickStatus.Cancelled);

        bricks[_brickId].status = BrickStatus.Cancelled;

        return bricks[_brickId].value;
    }

    function startWork(uint _brickId, string _builderId, string _nickName) 
        external onlyMain returns(bool success)
    {

        require(bricks[_brickId].status == BrickStatus.Active);
        require(_brickId >= 0);

        // bricks[_brickId]
        Builder memory builder = Builder({
            key: _builderId,
            nickName: _nickName,
            joined: true
        });
        brickBuilders[_brickId][msg.sender] = builder;

        return true;
    }

    function getBrickIds() external view returns(uint[]) {
        return brickIds;
    }    

    function setMain(address _address) public onlyOwner returns(bool) {
        main = _address;
        return true;
    }     
}
