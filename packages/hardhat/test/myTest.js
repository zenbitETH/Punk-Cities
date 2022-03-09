const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const fs = require("fs");
const axios = require("axios");
const mime = require("mime/lite");
const path = require("path");
const { NFTStorage, File } = require("nft.storage");
require("dotenv").config();

use(solidity);

describe("My Dapp", function () {
  let myContract;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  beforeEach(async () => {
    const YourContract = await ethers.getContractFactory("YourContract");
    myContract = await YourContract.deploy();

    const accounts = await ethers.getSigners();
    const signer1 = accounts[0]; // this should be the same as the signer used in the deployed contract
    const signer2 = accounts[1];
    const signer3 = accounts[2];

    const myContractSigner2 = await new ethers.Contract(
      myContract.address,
      YourContract.interface,
      signer2
    );
    const myContractSigner3 = await new ethers.Contract(
      myContract.address,
      YourContract.interface,
      signer3
    );

    const txRegisteringUser1 = await myContract.registerUser(
      "alice",
      "test",
      "test"
    );
    const txRegisteringUser2 = await myContractSigner2.registerUser(
      "bob",
      "test",
      "test"
    );
    const txRegisteringUser3 = await myContractSigner3.registerUser(
      "carol",
      "test",
      "test"
    );

    await txRegisteringUser1.wait();
    await txRegisteringUser2.wait();
    await txRegisteringUser3.wait();

    const txRegisterPlace = await myContract.registerPlace(
      0,
      0,
      "bari",
      "ipfs"
    );
    const txRegisterPlace2 = await myContract.registerPlace(
      0,
      1,
      "turi",
      "ipfs"
    );

    await txRegisterPlace.wait();
    await txRegisterPlace2.wait();

    const txVerifyPlace1 = await myContractSigner2.verifyPlace(0, 0);
    const txVerifyPlace2 = await myContractSigner3.verifyPlace(0, 1);

    await txVerifyPlace1.wait();
    await txVerifyPlace2.wait();

    const txTransferEnergyChipsUser1 = await myContract.transferEnergyAndchips(
      signer1.address,
      30,
      30
    );
    const txTransferEnergyChipsUser2 = await myContract.transferEnergyAndchips(
      signer2.address,
      40,
      40
    );
    const txTransferEnergyChipsUser3 = await myContract.transferEnergyAndchips(
      signer3.address,
      50,
      50
    );

    await txTransferEnergyChipsUser1.wait();
    await txTransferEnergyChipsUser2.wait();
    await txTransferEnergyChipsUser3.wait();

    const txDepositEnergyUser1 = await myContract.depositEnergy(0, 13);
    const txDepositEnergyUser2 = await myContractSigner2.depositEnergy(0, 10);
    const txDepositEnergyUser3 = await myContractSigner3.depositEnergy(0, 20);
    const txDepostiChipUser1 = await myContract.depositChip(0, 13);
    const txDepostiChipUser2 = await myContractSigner2.depositChip(0, 10);
    const txDepostiChipUser3 = await myContractSigner3.depositChip(0, 20);

    await txDepositEnergyUser1.wait();
    await txDepositEnergyUser2.wait();
    await txDepositEnergyUser3.wait();
    await txDepostiChipUser1.wait();
    await txDepostiChipUser2.wait();
    await txDepostiChipUser3.wait();
  });

  describe("YourContract", function () {
    it("Should return the right name for the registered place", async () => {
      expect(await myContract.getPlaceCity(0)).to.equal("bari");
    });

    it("Should return the right number of verifications + verifiers", async () => {
      const accounts = await ethers.getSigners();
      const signer1 = accounts[0];
      const signer2 = accounts[1];
      const signer3 = accounts[2];

      const verifiers = await myContract.getVerifiers(0);

      expect(verifiers[0]).to.equal(`${signer1.address}`);
      expect(verifiers[1]).to.equal(`${signer2.address}`);
      expect(verifiers[2]).to.equal(`${signer3.address}`);
      expect(verifiers.length).to.equal(3);
      expect(await myContract.placeIdToVerificationTimes(0)).to.equal(2);
    });

    it("Should return the right number of deposited energy and chips", async () => {
      const accounts = await ethers.getSigners();
      const signer1 = accounts[0]; // this should be the same as the signer used in the deployed contract
      const signer2 = accounts[1];
      const signer3 = accounts[2];

      //signer1
      expect(
        await myContract.playerEnergyDepositedPerPlaceId(signer1.address, 0)
      ).to.equal(13);
      expect(
        await myContract.playerChipDepositedPerPlaceId(signer1.address, 0)
      ).to.equal(13);
      //signer2
      expect(
        await myContract.playerEnergyDepositedPerPlaceId(signer2.address, 0)
      ).to.equal(10);
      expect(
        await myContract.playerChipDepositedPerPlaceId(signer2.address, 0)
      ).to.equal(10);
      //signer3
      expect(
        await myContract.playerEnergyDepositedPerPlaceId(signer3.address, 0)
      ).to.equal(20);
      expect(
        await myContract.playerChipDepositedPerPlaceId(signer3.address, 0)
      ).to.equal(20);

      expect(await myContract.energyPerAddress(signer1.address)).to.equal(19);
      expect(await myContract.chipPerAddress(signer1.address)).to.equal(17);
      // signer 2 verified 1 place previously so + 1 point
      expect(await myContract.energyPerAddress(signer2.address)).to.equal(31);
      expect(await myContract.chipPerAddress(signer2.address)).to.equal(30);
      // signer 3 verified 1 places previously so + 1 points
      expect(await myContract.energyPerAddress(signer3.address)).to.equal(31);
      expect(await myContract.chipPerAddress(signer3.address)).to.equal(30);
    });

    it("Upgrade should return the expected number of rewards", async () => {
      const accounts = await ethers.getSigners();
      const signer1 = accounts[0]; // this should be the same as the signer used in the deployed contract
      const signer2 = accounts[1];
      const signer3 = accounts[2];

      const YourContract = await ethers.getContractFactory("YourContract");

      const myContractSigner2 = await new ethers.Contract(
        myContract.address,
        YourContract.interface,
        signer2
      );

      const txUpgradePlace = await myContractSigner2.upgradePlace(0);
      await txUpgradePlace.wait();

      //signer 1 deposited. so x2 the amount deposited +1
      expect(await myContract.energyPerAddress(signer1.address)).to.equal(
        19 + 2 * 13 + 1
      );
      expect(await myContract.chipPerAddress(signer1.address)).to.equal(
        17 + 2 * 13 + 1
      );
      // signer 2 upgraded so x2 the amount deposited +1
      expect(await myContract.energyPerAddress(signer2.address)).to.equal(
        31 + 5 * 10 + 1
      );
      expect(await myContract.chipPerAddress(signer2.address)).to.equal(
        30 + 5 * 10 + 1
      );
      // signer 3 deposited so x2 the amount deposited +1
      expect(await myContract.energyPerAddress(signer3.address)).to.equal(
        31 + 2 * 20 + 1
      );
      expect(await myContract.chipPerAddress(signer3.address)).to.equal(
        30 + 2 * 20 + 1
      );
    });

    it("Registration should assign a new 1155NFT to the sender", async () => {
      const accounts = await ethers.getSigners();
      const signer1 = accounts[0];

      const balanceNFT0 = await myContract.balanceOf(signer1.address, 0);

      expect(balanceNFT0).to.equal(1);
    });

    it("Upgrade should create copies of 1155NFT and send to verifiers", async () => {
      const accounts = await ethers.getSigners();
      const signer1 = accounts[0];
      const signer2 = accounts[1];
      const signer3 = accounts[2];

      const YourContract = await ethers.getContractFactory("YourContract");
      const myContractSigner2 = await new ethers.Contract(
        myContract.address,
        YourContract.interface,
        signer2
      );
      const txUpgradePlace = await myContractSigner2.upgradePlace(0);
      await txUpgradePlace.wait();

      const balanceNFTUser1 = await myContract.balanceOf(signer1.address, 0);
      const balanceNFTUser2 = await myContract.balanceOf(signer2.address, 0);
      const balanceNFTUser3 = await myContract.balanceOf(signer3.address, 0);

      expect(balanceNFTUser1).to.equal(1); // register receiving one nft
      expect(balanceNFTUser2).to.equal(1); // verifier receiving one nft
      expect(balanceNFTUser3).to.equal(1); // verifier receiving one nft
    });

    it("Try to mint a place and add the proper metadata to the nft", async () => {
      const YourContract = await ethers.getContractFactory("YourContract");
      const accounts = await ethers.getSigners();
      const signer2 = accounts[1];
      const myContractSigner2 = await new ethers.Contract(
        myContract.address,
        YourContract.interface,
        signer2
      );

      const fileFromPath = async (filePath) => {
        const content = await fs.promises.readFile(filePath);
        const type = mime.getType(filePath);
        return new File([content], path.basename(filePath), { type });
      };

      const NFT_STORAGE_TOKEN = process.env.NFT_STORAGE_TOKEN;
      const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
      const image = await fileFromPath("./test/files/contract.PNG");
      const placeId = (await myContract.placeId()).toString();

      const metadata = await client.store({
        tokenID: placeId,
        name: "My sweet NFT",
        description: "Just try to funge it. You can't do it.",
        image: image,
      });

      console.log(metadata.url);

      const txRegisterPlace = await myContractSigner2.registerPlace(
        0,
        0,
        "turi",
        metadata.url
      );
      await txRegisterPlace.wait();
      expect(await myContract.uris(placeId)).to.equal(metadata.url);
    });
  });
});
