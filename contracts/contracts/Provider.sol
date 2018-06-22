pragma solidity 0.4.24;


interface Provider {
    function isBrickOwner(uint _brickId, address _address) external returns (bool success);
    function addBrick(string _title, string _url, string _description, uint _value) external returns (uint id);
    function changeBrick(uint _brickId, string _title, string _url, string _description, uint _value) external returns (bool success);
    function accept(uint _brickId, address[] _builderAddresses, uint[] percentages, uint _additionalValue) external returns (uint total);
    function cancel(uint _brickId) external returns (uint value);
    function resetBrickIdTo(uint _start) external returns (uint);     
    function startWork(uint _brickId, string _builderId, string _nickName) external returns(bool success);
    function getBrickIds() external view returns(uint[]);
}