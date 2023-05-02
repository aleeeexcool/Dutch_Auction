const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("DutchAuction", function () {
    const startingPrice = ethers.utils.parseEther("1");
    const discountRate = 5;
    const item = "NFT";
    let DutchAuction, auction, seller, user;

    beforeEach(async () => {
        [seller, user] = await ethers.getSigners();
        DutchAuction = await ethers.getContractFactory("DutchAuction");
        auction = await DutchAuction.deploy(startingPrice, discountRate, item);
        await auction.deployed();
    });

    it("should deploy with the right contructor's arrguments", async () => {
        expect(await auction.startingPrice()).to.equal(startingPrice);
        expect(await auction.discountRate()).to.equal(discountRate);
        expect(await auction.item()).to.equal(item);
    });

    
})