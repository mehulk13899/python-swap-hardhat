// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ICO
{
    using SafeMath for uint256;

    IERC20 tokenAddress;
    
    uint256 tokenValue;
    
    address owner;

    mapping(address=>bool) public listOfBlacklistAddress;
    
    event BlacklistAddress(
        address userAddress,
        address owner
    );

    event OwnerAddressUpdate(
        address newOwnerAddress,
        address oldOwnerAddress
    );

    event TokenTransfer(
        address tokenBuyer,
        address tokenSeller,
        uint256 tokenAmount
    );

    event TokenValueUpdate(
        uint256 tokenValue,
        address owner
    );

    event TokenWithdraw(
        address owner,
        uint256 amount
    );

    modifier isBlacklistAddress(
       address _buyerAddress
    )
    {
       require(!listOfBlacklistAddress[_buyerAddress],"black Address not allowed");
       _;
    }

    modifier isContractEnoughToken(
       uint256 _buyingAmount
    )
    {
      uint256 tokenAmount =  _calculatingTokenTransfer(_buyingAmount); 
      require(tokenAddress.balanceOf(address(this)) >= tokenAmount,"not enough token");
      _;
    }

    modifier onlyOwner()
    {
        require(msg.sender == owner,"not owner");
        _;
    }

    modifier priceGreaterThanZero(
        uint256 _price
    ) 
    {
        require(_price > 0, "Price cannot be 0");
        _;
    }

    modifier zeroAddressNotAllowed(
        address _address
    )
    {
        require(_address != address(0),"zero address not allowed");
        _;
    }

    constructor(
        uint256 _tokenValue,
        address _owner,
        address _tokenAddress
    )
    {
        tokenValue = _tokenValue;   //1 matic = tokenValue*(10**18)
        owner = _owner;
        tokenAddress = IERC20(_tokenAddress);
    }

    function addBlacklistAddress(
        address _userAddress
    ) external
      onlyOwner()
      zeroAddressNotAllowed(_userAddress)
    {
        listOfBlacklistAddress[_userAddress] = true;
        emit BlacklistAddress(_userAddress, owner);
    }

    function updateOwnerAddress(
        address _owner
    ) external 
      onlyOwner()
      zeroAddressNotAllowed(_owner)
    {
        owner = _owner;
        emit OwnerAddressUpdate(_owner, msg.sender);
    }
    
    function updateTokenValue(
        uint256 _tokenValue
    ) external
      onlyOwner()
      priceGreaterThanZero(_tokenValue)
    {
       tokenValue = _tokenValue;
       emit TokenValueUpdate(tokenValue, owner);
    }

    function withdrawToken(
        uint256 _tokenAmount
    )
       external
       onlyOwner()
       priceGreaterThanZero(_tokenAmount)
    {
       tokenAddress.transfer(owner,_tokenAmount); 
       emit TokenWithdraw(owner, _tokenAmount);
    }

    function withdrawNativeCoin(
        uint256 _amount
    ) external
      onlyOwner()
    {
        _amountTransfer(owner, _amount);
    }

    function swapMaticForToken() 
      external 
      payable
      isBlacklistAddress(msg.sender)
      priceGreaterThanZero(msg.value)
      isContractEnoughToken(msg.value) 
    {
       uint256 tokenAmount =  _calculatingTokenTransfer(msg.value); 
       tokenAddress.transfer(msg.sender, tokenAmount); 

        _amountTransfer(owner, msg.value);
        emit TokenTransfer(msg.sender, owner, tokenAmount);
    }
    
    function _calculatingTokenTransfer(uint256 _amount) 
       internal
       view
       returns(uint256)
    {
       uint256 tokenAmount = _amount.mul(tokenValue);
       return tokenAmount;
    }

    function _amountTransfer(
        address _tokenSeller,
        uint256 _buyAmount
    ) internal
    {
        (bool success,)  = _tokenSeller.call{value: _buyAmount}("");
        require(success, "refund failed");
    }

    receive() payable external {}
}