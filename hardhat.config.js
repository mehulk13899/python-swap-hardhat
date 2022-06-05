require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

let secret = require("./secreate")

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: "0.8.4",
  networks: {
    matic:{
      url:secret.url,
      accounts:[secret.key]
    }
  },
  etherscan:{
    apiKey:"2KTWQ4SDIRD4Y9SPWB2Y6MYXTDFYSUZI7I"
  }
};