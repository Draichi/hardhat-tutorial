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
      expect(await aiToken.owner()).to.equal(owner.address);
    });
    it("should assign the total supply of tokens to the owner", async () => {
      const ownerBalance = await aiToken.balanceOf(owner.address);
      expect(await aiToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", () => {
    it("should transfer tokens between accounts", async () => {
      await aiToken.transfer(addr1.address, 50);
      const addr1Balance = await aiToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // transfer 50 from addr1 to addr2
      await aiToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await aiToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
    it("should fail if sender doesn't have enough tokens", async () => {
      const initialOwnerBalance = await aiToken.balanceOf(owner.address);

      // addr1 has 0 tokens
      await expect(
        aiToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // owner balance shouldn't have changed
      expect(await aiToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
    it('should update balances after transfers', async () => {
      const initialOwnerBalance = await aiToken.balanceOf(owner.address)

      // ytansfer 100 tokens from owner to addr1
      await aiToken.transfer(addr1.address, 100)

      // ytansfer 50 tokens from owner to addr2
      await aiToken.transfer(addr2.address, 50)

      const finalOwnerBalance = await aiToken.balanceOf(owner.address)
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150)

      const addr1Balance = await aiToken.balanceOf(addr1.address)
      expect(addr1Balance).to.equal(100)

      const addr2Balance = await aiToken.balanceOf(addr2.address)
      expect(addr2Balance).to.equal(50)
    })
  });
});
