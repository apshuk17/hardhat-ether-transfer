const { ethers, deployments, getNamedAccounts } = require("hardhat");

const main = async () => {
  const deployer = (await getNamedAccounts()).deployer;
  await deployments.fixture(["all"]);
  const simpleContract = await ethers.getContract("SimpleContract");
  const startingContractBalance = await simpleContract.getBalance();
  console.log("##startingContractBalance", startingContractBalance.toString());
  const signer = await ethers.getSigner(deployer);

  const params = {
    from: deployer,
    to: simpleContract.address,
    value: ethers.utils.parseEther("1"),
  };

  const txResponse = await signer.sendTransaction(params);

  await txResponse.wait(1);
  const finalContractBalance = await simpleContract.getBalance();

  console.log("##finalContractBalance", finalContractBalance.toString());
};

(async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.log("##Error", err);
    process.exit(1);
  }
})();
