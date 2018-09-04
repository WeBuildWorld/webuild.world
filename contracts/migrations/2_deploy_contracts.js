let WeBuildWordImplementation = artifacts.require("WeBuildWorldImplementation");
let WeBuildWorld = artifacts.require("WeBuildWorld");

module.exports = function(deployer, network) {
  deployer.deploy(WeBuildWordImplementation);
  deployer.deploy(WeBuildWorld);
};
