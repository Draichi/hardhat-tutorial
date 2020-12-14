import { ethers } from "hardhat";

(async function main() {
    try {
        const [deployer] = await ethers.getSigners()
        console.log("Deploying contract with account:", deployer.address);
        console.log("ACcount balance:", await (await deployer.getBalance()).toString())

        const Token = await ethers.getContractFactory("Token")
        const aiToken = await Token.deploy()

        console.log("Contract address:", aiToken.address)
        process.exit(0)

    } catch (error) {
        console.error(error)
        process.exit(1)

    }

})()
