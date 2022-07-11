module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;

    await deploy("SimpleContract", {
        from: deployer,
        log: true
    })

    log("Simple Contract Deployed");
}

module.exports.tags = ["all"];