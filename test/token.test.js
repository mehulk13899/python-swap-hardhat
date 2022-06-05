
const GLDToken = artifacts.require('GLDToken');
const KycContract = artifacts.require("KycContract");
const MyTokenSale = artifacts.require("MyTokenSale");

contract('GLDToken', accounts => {

    const BigNumber = web3.BigNumber;
    const BN = web3.utils.BN;

    require('chai')
        .use(require('chai-bignumber')(BigNumber))
        .should();

    const _name = 'GLDToken';
    const _symbol = 'MKT';
    const _decimals = 18;
    const _rate = 100;

    beforeEach(async function () {
        this.token = await GLDToken.new(_name, _symbol);
        this.kyc_contract = await KycContract.new();
        this.myTokenSale = await MyTokenSale.new(_rate, accounts[0],
            this.token.address, this.kyc_contract.address);
    });

    describe('token attributes', function () {
        it('has the correct name', async function () {
            const name = await this.token.name();
            name.should.equal(_name);
        });

        it('has the correct symbol', async function () {
            const symbol = await this.token.symbol();
            symbol.should.equal(_symbol);
        });

        it('has the correct decimals', async function () {
            const decimals = await this.token.decimals();
            decimals.words[0].should.be.bignumber.equal((_decimals));
        });
    });
    describe('Deploy KYC Contaract', function () {
        it('has the correct name', async function () {
            const name = await this.token.name();
            name.should.equal(_name);
        });
    });

    describe('crowdsale', function () {
        it('tracks the rate', async function () {
            const rateN = await this.myTokenSale.rate();
            rateN.words[0].should.be.bignumber.equal(_rate);
        });

        it('tracks the wallet', async function () {
            const wallet = await this.myTokenSale.wallet();
            wallet.should.equal(accounts[0]);
        });

        it('tracks the token', async function () {
            const token = await this.myTokenSale.token();
            token.should.equal(this.token.address);
        });
    });

    describe('Transfer Ownership', function () {
        it('tracks the rate', async function () {

            await this.token.transfer(this.myTokenSale.address,
                web3.utils.toWei('1000', 'ether'));

            let userBalance = await this.token.balanceOf(accounts[0])
            userBalance.should.be.bignumber.equal(web3.utils.toWei('1000', 'ether'));


            console.log("user balance is ", userBalance)
            let myTokenSaleBalance = await this.token.balanceOf(this.myTokenSale.address)
            console.log("myTokenSale contract balance is ", myTokenSaleBalance)
        });
    });

});