const WeBuildWorldImplementation = artifacts.require("WeBuildWorldImplementation");
const WeBuildWorld = artifacts.require("WeBuildWorld");
const Promise = require("bluebird");

contract('WeBuildWord', function (accounts) {

  let main;
  let implement;
  let owner = accounts[0];

  before("Contracts should be able to deploy.", async () => {
    return await Promise.all([
      WeBuildWorldImplementation.deployed(),
      WeBuildWorld.deployed(),
    ]).spread(async (weBuildWorldImplementation, weBuildWorld) => {
      assert.ok(weBuildWorldImplementation, "WeBuildWorldImplementation contract is not deployed.");
      assert.ok(weBuildWorld, "WeBuildWorld contract is not deployed.");

      await weBuildWorldImplementation.setMain(weBuildWorld.address);
      await weBuildWorld.upgradeProvider(weBuildWorldImplementation.address);

      main = weBuildWorld;
      implement = weBuildWorldImplementation;
      
    });
  });

  it("should be success added a brick.", async () => {

    const txObj = await main.addBrick('brick title',
      'https://github.com/hello/mock/issue/100',
      'mock brick description',
      ['mock', 'test'], {
        value: web3.toWei(1, "ether"),
        from: owner
      });
    assert.ok(txObj, "success add brick.");

    const ids = (await main.getBrickIds(0, 10, ['mock', 'test'], -1, 0, 0) || [])
      .map((id) => id.toNumber())
      .filter(id => id !== 0);

    assert.equal(ids.length, 1, 'An brick can be found.');
  });

});