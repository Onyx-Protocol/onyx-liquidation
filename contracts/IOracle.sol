// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

interface IOracle {
    function getUnderlyingPrice(address oToken) external view returns (uint256);
}
