import { task, HardhatUserConfig } from "hardhat/config"
import "@nomiclabs/hardhat-waffle"

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.address)
  }
})

const config: HardhatUserConfig = {
  solidity: "0.7.3",

}

export default config
