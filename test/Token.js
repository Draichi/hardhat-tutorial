const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", () => {
  let Token;
  let aiToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async () => {
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    aiToken = await Token.deploy();
  });

  describe("Deployment", () => {
    it("should set the right owner", async () => {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });
    it("should assign the total supply of tokens to the owner", async () => {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", () => {
    it("should transfer tokens between accounts", async () => {
      await hardhatToken.transfer(addr1.address, 50);
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // transfer 50 from addr1 to addr2
      await hardhatToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
    it("should fail if sender doesn't have enough tokens", async () => {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // addr1 has 0 tokens
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // owner balance shouldn't have changed
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
    it('should update balances after transfers', async () => {})
  });
});
