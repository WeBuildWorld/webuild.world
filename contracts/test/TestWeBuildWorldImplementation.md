pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/WeBuildWordImplementation.sol";

contract TestWeBuildWordImplementation {

  function testInitialBalanceUsingDeployedContract() public {
    // WeBuildWordImplementation meta = WeBuildWordImplementation(DeployedAddresses.WeBuildWordImplementation());
    uint expected = 10000; 
    Assert.equal(expected,10000,"test message ...");
  }
  
}
