pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract ERC20Extended is ERC20 {
    uint256 public decimals;
    string public name;
    string public symbol;
}