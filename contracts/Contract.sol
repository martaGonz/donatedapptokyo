// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@celo/contractkit/contracts/registry/Attestations.sol";

contract DonateCELO {
     uint256 totalDonations;
     address payable public owner;

     constructor() payable {
        owner = payable(msg.sender);
     }

     event NewDonation (
        address indexed from,
        uint256 timestamp,
        string message,
        string name
     ); 

    struct Donation {
        address sender;
        string message;
        string name;
        uint256 timestamp;
    }

    Donation[] donation;

    function getAllDonation() public view returns (Donation[] memory) {
        return donation;
    }

     function getTotalDonation() public view returns (uint256) {
        return totalDonations;
    }

    function sendDonation(
        string memory _message,
        string memory _name
    )
        payable public {
            require(msg.value == 0.01 ether, "Donate 0.01 ETH");
            
            totalDonations += 1;
            donation.push(Donation(msg.sender, _message, _name, block.timestamp));

            (bool success,) = owner.call{value: msg.value}("");
            require(success, "Failed to send Ether");

            emit NewDonation(msg.sender, block.timestamp, _message, _name);

        }
  
}
