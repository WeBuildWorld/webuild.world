 // solhint-disable-next-line compiler-fixed, compiler-gt-0_4
pragma solidity ^0.4.23;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "solidity-utils/contracts/lib/Dictionary.sol";
import "./Provider.sol";


contract WeBuildWordImplementation is Ownable, Provider {
    using SafeMath for uint256;	
    using Dictionary for Dictionary.Data;

    enum BrickStatus { Inactive, Active, Completed, Cancelled }

    struct Builder {
        address addr;
        uint dateAdded;
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
        uint32 numBuilders;
        BrickStatus status;
        address[] winners;
        mapping (uint => Builder) builders;
    }

    address public main = 0x0;
    mapping (uint => Brick) public bricks;

    string public constant VERSION = "0.1";
    Dictionary.Data public brickIds;
    uint public constant DENOMINATOR = 10000;

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
        // solhint-disable-next-line
        require(bricks[_brickId].owner == 0x0 || bricks[_brickId].owner == tx.origin);

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
            numBuilders: 0,
            winners: new address[](0)
        });

        // only add when it's new
        if (bricks[_brickId].owner == 0x0) {
            brickIds.insertBeginning(_brickId, "");
        }
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
            bricks[_brickId].value = bricks[_brickId].value.add(_value);
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
        bool included = false;
        for (uint i = 0; i < _winners.length; i++) {
            // solhint-disable-next-line
            require(_winners[i] != tx.origin, "Owner should not win this himself");
            for (uint j =0; j < bricks[_brickId].numBuilders; j++) {
                if (bricks[_brickId].builders[j].addr == _winners[i]) {
                    included = true;
                    break;
                }
            }
            total = total.add(_weights[i]);
        }

        require(included, "Winner doesn't participant");
        require(total == DENOMINATOR, "total should be in total equals to denominator");

        bricks[_brickId].status = BrickStatus.Completed;
        bricks[_brickId].winners = _winners;
        // solhint-disable-next-line
        bricks[_brickId].dateCompleted = now;

        if (_value > 0) {
            bricks[_brickId].value = bricks[_brickId].value.add(_value);
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

    function startWork(uint _brickId, string _builderId, string _nickName, address _builderAddress) 
        external onlyMain returns(bool success)
    {
        require(_builderAddress != 0x0);
        require(bricks[_brickId].status == BrickStatus.Active);
        require(_brickId >= 0);

        bool included = false;

        for (uint i = 0; i < bricks[_brickId].numBuilders; i++) {
            if (bricks[_brickId].builders[i].addr == _builderAddress) {
                included = true;
                break;
            }
        }
        require(!included);

        // bricks[_brickId]
        Builder memory builder = Builder({
            addr: _builderAddress,
            key: _builderId,
            nickName: _nickName,
            // solhint-disable-next-line
            dateAdded: now
        });
        bricks[_brickId].builders[bricks[_brickId].numBuilders++] = builder;

        return true;
    }

    function getBrickIds() external view returns(uint[]) {
        return brickIds.keys();
    }    

    function getBrick(uint _brickId) external view returns (
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
        Brick memory brick = bricks[_brickId];
        return (
            brick.title,
            brick.url,
            brick.description,
            brick.owner,
            brick.value,
            brick.dateCreated,
            brick.dateCompleted,
            brick.numBuilders,
            uint32(brick.status),
            brick.winners
        );
    }

    function getBrickBuilders(uint _brickId) external view returns (
        address[] addresses,
        uint[] dates,
        bytes32[] keys,
        bytes32[] names
    )
    {
        // Brick memory brick = bricks[_brickId];
        addresses = new address[](bricks[_brickId].numBuilders);
        dates = new uint[](bricks[_brickId].numBuilders);
        keys = new bytes32[](bricks[_brickId].numBuilders);
        names = new bytes32[](bricks[_brickId].numBuilders);

        for (uint i = 0; i < bricks[_brickId].numBuilders; i++) {
            addresses[i] = bricks[_brickId].builders[i].addr;
            dates[i] = bricks[_brickId].builders[i].dateAdded;
            keys[i] = keccak256(abi.encodePacked(bricks[_brickId].builders[i].key));
            names[i] = keccak256(abi.encodePacked(bricks[_brickId].builders[i].nickName));
        }
    }    

    function setMain(address _address) public onlyOwner returns(bool) {
        main = _address;
        return true;
    }     
}
