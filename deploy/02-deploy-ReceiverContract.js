module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;

    await deploy("ReceiverContract", {
        from: deployer,
        log: true
    })

    log("##ReceiverContract deployed")
}

module.exports.tags = ["all"];