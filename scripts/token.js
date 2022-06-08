const hre = require("hardhat");
const { web3 } = require('hardhat');

async function main() {

    const _name = 'Python';
    const _symbol = 'PCH';
    const Python = await hre.ethers.getContractFactory("Python");
    const token = await Python.deploy(_name, _symbol);
    await token.deployed();
    console.log("Token deployed to:", token.address);
    const token_address = token.address;


    /* Deploy KYC Contract */
    const KycContract = await hre.ethers.getContractFactory("KycContract");
    const kyc = await KycContract.deploy();
    console.log("MyKYC deployed to:", kyc.address);
    const kyc_address = kyc.address;

    /* Deploy Crowdsale Contract */
    const Crowdsale = await hre.ethers.getContractFactory("Crowdsale");
    const crowdsale = await Crowdsale.deploy(100, "0xDeACd4Dc175621915f964249b2ffaFc83ea050D3", token_address);
    console.log("Crowdsale deployed to:", crowdsale.address);
    const crowdsale_address = crowdsale.address;

    await token.transfer(crowdsale_address, web3.utils.toWei('1000000000000', 'ether'))
    const data = await token.balanceOf("0x1D5E50754b504A6893E692C92aFeB2d530E79FB1");
    console.log(data);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });