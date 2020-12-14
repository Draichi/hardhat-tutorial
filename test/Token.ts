import { expect } from "chai"
import { ethers } from "hardhat"
import { Signer, ContractFactory, Contract } from "ethers"

describe("Token contract", () => {
  let Token: ContractFactory;
  let aiToken: Contract;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  let addrs: Signer[];

  beforeEach(async () => {
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    aiToken = await Token.deploy();
  });

  describe("Deployment", () => {
    it("should set the right owner", async () => {
      expect(await aiToken.owner()).to.equal(await owner.getAddress());
    });
    it("should assign the total supply of tokens to the owner", async () => {
      const ownerBalance = await aiToken.balanceOf(await owner.getAddress());
      expect(await aiToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", () => {
    it("should transfer tokens between accounts", async () => {
      await aiToken.transfer(await addr1.getAddress(), 50);
      const addr1Balance = await <Number>aiToken.balanceOf(await addr1.getAddress());
      expect(addr1Balance).to.equal(50);

      // transfer 50 from addr1 to addr2
      await aiToken.connect(addr1).transfer(await addr2.getAddress(), 50);
      const addr2Balance = await aiToken.balanceOf(await addr2.getAddress());
      expect(addr2Balance).to.equal(50);
    });
    it("should fail if sender doesn't have enough tokens", async () => {
      const initialOwnerBalance = await aiToken.balanceOf(await owner.getAddress());

      // addr1 has 0 tokens
      await expect(
        aiToken.connect(addr1).transfer(await owner.getAddress(), 1)
      ).to.be.revertedWith("Not enough tokens");

      // owner balance shouldn't have changed
      expect(await aiToken.balanceOf(await owner.getAddress())).to.equal(
        initialOwnerBalance
      );
    });
    it('should update balances after transfers', async () => {
      const initialOwnerBalance = await aiToken.balanceOf(await owner.getAddress())

      // ytansfer 100 tokens from owner to addr1
      await aiToken.transfer(await addr1.getAddress(), 100)

      // ytansfer 50 tokens from owner to addr2
      await aiToken.transfer(await addr2.getAddress(), 50)

      const finalOwnerBalance = await aiToken.balanceOf(await owner.getAddress())
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150)

      const addr1Balance = await aiToken.balanceOf(await addr1.getAddress())
      expect(addr1Balance).to.equal(100)

      const addr2Balance = await aiToken.balanceOf(await addr2.getAddress())
      expect(addr2Balance).to.equal(50)
    })
  });
});
