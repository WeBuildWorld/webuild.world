pragma solidity 0.4.24;


interface Provider {
    function isBrickOwner(uint _brickId, address _address) external returns (bool success);
    function addBrick(uint _brickId, bytes32 _title, bytes32 _url, bytes32 _description, uint _value) external returns (bool success);
    function changeBrick(uint _brickId, bytes32 _title, bytes32 _url, bytes32 _description, uint _value) external returns (bool success);
    function accept(uint _brickId, address[] _builderAddresses, uint[] percentages, uint _additionalValue) external returns (uint total);
    function cancel(uint _brickId) external returns (uint value);
    function startWork(uint _brickId, bytes32 _builderId, bytes32 _nickName, address _builderAddress) external returns(bool success);
    function getBrickIds() external view returns(uint[]);
    function getBrick(uint _brickId) external view returns(
        bytes32 title,
        bytes32 url,
        bytes32 description,
        address owner,
        uint value,
        uint dateCreated,
        uint dateCompleted,
        uint32 builders,
        uint32 status,
        address[] winners
    );
    function getBrickBuilders(uint _brickId) external view returns (
        address[] addresses,
        uint[] dates,
        bytes32[] keys,
        bytes32[] names
    );
}