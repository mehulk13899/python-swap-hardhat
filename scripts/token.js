const hre = require("hardhat");

async function main() {

    const GLDToken = await hre.ethers.getContractFactory("GLDToken");
    const token = await GLDToken.deploy();
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
    const crowdsale = await Crowdsale.deploy(100, "0x0B6319DbcBB51f138101A8BA8578Ff7674abc653", token_address);
    console.log("Crowdsale deployed to:", crowdsale.address);
    const crowdsale_address = crowdsale.address;

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });