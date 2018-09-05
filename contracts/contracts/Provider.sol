pragma solidity 0.4.24;


interface Provider {
    function isBrickOwner(uint _brickId, address _address) external view returns (bool success);
    function addBrick(uint _brickId, string _title, string _url, uint _expired, string _description, bytes32[] _tags, uint _value)
        external returns (bool success);
    function changeBrick(
        uint _brickId,
        string _title,
        string _url,
        string _description,
        bytes32[] _tags,
        uint _value) external returns (bool success);
    function accept(uint _brickId, address[] _builderAddresses, uint[] percentages, uint _additionalValue) external returns (uint total);
    function cancel(uint _brickId) external returns (uint value);
    function startWork(uint _brickId, bytes32 _builderId, bytes32 _nickName, address _builderAddress) external returns(bool success);
    function getBrickIds() external view returns(uint[]);
    function getBrickSize() external view returns(uint);
    function getBrick(uint _brickId) external view returns(
        string title,
        string url, 
        address owner,
        uint value,
        uint32 dateCreated,
        uint32 dateCompleted, 
        uint32 expired,
        uint status
    );

    function getBrickDetail(uint _brickId) external view returns(
        bytes32[] tags, 
        string description, 
        uint32 builders, 
        address[] winners
    );

    function getBrickBuilders(uint _brickId) external view returns (
        address[] addresses,
        uint[] dates,
        bytes32[] keys,
        bytes32[] names
    );

    function filterBrick(
        uint _brickId, 
        bytes32[] _tags, 
        uint _status, 
        uint _started,
        uint _expired
        ) external view returns (
      bool
    );


    function participated( 
        uint _brickId,
        address _builder
        ) external view returns (
        bool
    ); 
}