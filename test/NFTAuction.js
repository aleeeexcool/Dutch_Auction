const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("NFTAuction", function () {
    const auctionFee = 200;
    const auctionFeeRecipient = "0x1234567890123456789012345678901234567890";
    let NFTAuction, auction, owner;

    beforeEach(async () => {
        [owner] = await ethers.getSigners();
        NFTAuction = await ethers.getContractFactory("NFTAuction");
        auction = await NFTAuction.deploy(auctionFee, auctionFeeRecipient);
        await auction.deployed();
    });

    it("should deploy with the right contructor's arrguments and the right owner", async () => {
        expect(await auction._auctionFee()).to.equal(auctionFee);
        expect(await auction._auctionFeeRecipient()).to.equal(auctionFeeRecipient);
        expect(await auction.owner()).to.equal(owner.address);
    });

    it("should revert if the auction fee is greater than 10000", async () => {
        let zeroAddress = "0x0000000000000000000000000000000000000000";
        await expect(auction.setAuctionFeeRecipient(zeroAddress)).to.be.revertedWith("Recipient can't be zero address.");
    });

    it("should revert if the auction fee recipient is the zero address", async () => {
        await expect(auction.setAuctionFee(1001)).to.be.revertedWith("Fee can't be more than 10%.");
    });
})