// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

error SimpleContract__TransactionFail();
error SimpleContract__NotTheOwner();

contract SimpleContract {
    address payable private immutable i_owner;

    event SimpleContractLog(
        uint256 indexed amount,
        bytes data
    );

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert SimpleContract__NotTheOwner();
        }
        _;
    }

    constructor() {
        i_owner = payable(msg.sender);
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function withdraw() external payable onlyOwner {
        (bool success, ) = i_owner.call{value: getBalance()}("");
        if (!success) {
            revert SimpleContract__TransactionFail();
        }
    }

    function transferFundsUsingCall(address _to, uint256 amount) external {
        require(_to != address(0), "Invalid Receicer Address");
        require(amount <= getBalance(), "Insufficient Funds");
        (bool success, ) = _to.call{value: amount}(abi.encodeWithSignature("doesNotExist()"));
        if (!success) {
            revert SimpleContract__TransactionFail();
        }
        emit SimpleContractLog(amount, "");
    }
}
