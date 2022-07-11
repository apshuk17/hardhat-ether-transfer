const { ethers, deployments, getNamedAccounts } = require("hardhat");

const main = async () => {
  const deployer = (await getNamedAccounts()).deployer;
  await deployments.fixture(["all"]);
  const simpleContract = await ethers.getContract("SimpleContract", deployer);
  const startingContractBalance = await simpleContract.getBalance();
  console.log("##startingContractBalance", startingContractBalance.toString());
  const signer = await ethers.getSigner(deployer);

  // Initial Signer Balance
  let signerBalance = await signer.getBalance();

  console.log(
    "##Initial Signer Balance",
    ethers.utils.formatUnits(signerBalance)
  );

  const params = {
    from: deployer,
    to: simpleContract.address,
    value: ethers.utils.parseEther("1"),
  };
  // Deposit Ether
  const txResponse = await signer.sendTransaction(params);
  await txResponse.wait(1);

  // Signer's Balance After Deposit
  signerBalance = await signer.getBalance();

  console.log(
    "##After Deposit Signer's Balance",
    ethers.utils.formatUnits(signerBalance)
  );

  // Withdraw Ether
  const withdrawTxResponse = await simpleContract.withdraw();
  await withdrawTxResponse.wait(1);

  // Signer's Balance After Withdraw
  signerBalance = await signer.getBalance();

  console.log(
    "##After Withdraw Signer's Balance",
    ethers.utils.formatUnits(signerBalance)
  );

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
