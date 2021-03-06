// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  var totalSupply = 1 * (10 ** 4) * (10 ** 18);

  const Token = await hre.ethers.getContractFactory("ICO");
  const token = await Token.deploy("0x0B6319DbcBB51f138101A8BA8578Ff7674abc653", totalSupply);

  await token.deployed();


  // We get the contract to deploy

  var tokenValue = 10;

  const ICO = await hre.ethers.getContractFactory("ICO");
  const ico = await ICO.deploy(tokenValue, "0x0B6319DbcBB51f138101A8BA8578Ff7674abc653", token.address);

  await ico.deployed();

  console.log("token deployed to:", token.address);
  console.log("ico deployed to:", ico.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
