const { ethers, deployments, getNamedAccounts } = require("hardhat");

const main = async () => {
  const deployer = (await getNamedAccounts()).deployer;
  await deployments.fixture(["all"]);
  const simpleContract = await ethers.getContract("SimpleContract", deployer);
  const receiverContract = await ethers.getContract("ReceiverContract");
  const simpleContractAddress = simpleContract.address;
  const receiverContractAddress = receiverContract.address;

  // Initial Contract balances
  let simpleContractBalance = await simpleContract.getBalance();
  let receiverContractBalance = await receiverContract.getBalance();

  console.log(
    "##Initial SimpleContract Balance",
    ethers.utils.formatEther(simpleContractBalance)
  );
  console.log(
    "##Initial ReceiverContract Balance",
    ethers.utils.formatEther(receiverContractBalance)
  );

  // Transfer funds to SimpleContract
  const signer = await ethers.getSigner(deployer);
  const params = {
    from: deployer,
    to: simpleContractAddress,
    value: ethers.utils.parseEther("10"),
  };

  const txResponse = await signer.sendTransaction(params);

  await txResponse.wait(1);
  simpleContractBalance = await simpleContract.getBalance();

  console.log(
    "##SimpleContract Balance after Receiving Funds",
    ethers.utils.formatEther(simpleContractBalance)
  );

  // Transfer Funds from SimpleContract to ReceiverContract
  const sToRTxResponse = await simpleContract.transferFundsUsingCall(
    receiverContractAddress,
    ethers.utils.parseEther("3")
  );
  const sToRTxReceipt = await sToRTxResponse.wait(1);
  const events = sToRTxReceipt.events[1];

  console.log("##events", events.args.amount.toString(), events.args.data);

  simpleContractBalance = await simpleContract.getBalance();
  receiverContractBalance = await receiverContract.getBalance();

  console.log(
    "##Final SimpleContract Balance",
    ethers.utils.formatEther(simpleContractBalance)
  );
  console.log(
    "##Final ReceiverContract Balance",
    ethers.utils.formatEther(receiverContractBalance)
  );
};

(async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.log("##err", err);
    process.exit(1);
  }
})();
