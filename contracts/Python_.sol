//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PythonOld is ERC20 {

    address owner;

    constructor(
        address _owner
    ) ERC20("Python", "PYT") 
    {
        uint256 _initial_supply = 1 * (10**12) * (10**18);
        owner = _owner;
        _mint(_owner, _initial_supply);
    }

    function mintToken(
        uint256 _amount,
        address _mintingaddress
    ) external 
    {
        require(msg.sender == owner,"not owner");

        _mint(_mintingaddress,_amount);
    }
}