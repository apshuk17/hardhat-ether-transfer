// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract ReceiverContract {
    event ReceiverContractLog(
        uint256 indexed value,
        bytes indexed data
    );

    fallback() external payable {
        emit ReceiverContractLog(msg.value, msg.data);
    }

    receive() external payable {
        emit ReceiverContractLog(msg.value, "");
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
