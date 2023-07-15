const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

const ADMIN_DEFAULT_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000"
const MEMBER_ROLE = "0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636"
const CREATOR_ROLE = "0x828634d95e775031b9ff576b159a8509d3053581a8c9c4d7d86899e0afcd882f"
const ADMIN_ROLE = "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775"

describe("ScanSecure", function () {
  // Fixture

  async function deployContextInit() {
    // Déploiement du contrat
    // const TetherToken = await ethers.getContractFactory("TetherToken");
    // const tetherToken = await TetherToken.deploy(420000000);
    // await tetherToken.deployed();

    const ScanSecure = await ethers.getContractFactory("ScanSecure");
    const scanSecure = await ScanSecure.deploy("ipfs://monurl.com/<id>.json");
    await scanSecure.deployed();

    // Get provider with signer
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    return { scanSecure, owner, addr1, addr2, addr3 };
  };

  async function deployContextRegistered() {
    const { scanSecure, owner, addr1, addr2, addr3 } = await loadFixture(deployContextInit);

    await scanSecure.connect(addr1).register('Addr1')
    await scanSecure.connect(addr2).register('Addr2')

    return { scanSecure, owner, addr1, addr2, addr3 };
  };

  async function deployContextAskCertification() {
    const { scanSecure, owner, addr1, addr2, addr3 } = await loadFixture(deployContextRegistered);

    await scanSecure.connect(addr1).askCertification()
    await scanSecure.connect(addr2).askCertification()

    return { scanSecure, owner, addr1, addr2, addr3 };
  };

  async function deployContextAnswerCertification() {
    const { scanSecure, owner, addr1, addr2, addr3 } = await loadFixture(deployContextAskCertification);

    await scanSecure.connect(owner).certificationAnswer(true, addr1.address)
    await scanSecure.connect(owner).certificationAnswer(false, addr2.address)

    return { scanSecure, owner, addr1, addr2, addr3 };
  };

  async function deployContextCreateEvent() {
    const { scanSecure, owner, addr1, addr2, addr3 } = await loadFixture(deployContextAnswerCertification);

    await scanSecure.connect(addr1).createEvent("Event1", "hash_ipfs")
    await scanSecure.connect(addr1).createEvent("Event2", "hash_ipfs")

    return { scanSecure, owner, addr1, addr2, addr3 };
  };

  async function deployContextCreateTickets() {
    const { scanSecure, owner, addr1, addr2, addr3 } = await loadFixture(deployContextCreateEvent);

    await scanSecure.connect(addr1).createTickets(0, 1000)
    await scanSecure.connect(addr1).createTickets(1, 500)


    return { scanSecure, owner, addr1, addr2, addr3 };
  };

  describe("Deployment", function () {
    // describe("Tether", function () {
    //   it("Should rigth event created", async function () {
    //     const { scanSecure, tetherToken, addr1 } = await loadFixture(deployContextInit);

    //     expect(await tetherToken.name()).to.equal("USDT");

    //   });
    // })

    describe("Role", function () {
      it("Should rigth ADMIN_ROLE", async function () {
        const { scanSecure } = await loadFixture(deployContextInit);
        expect(await scanSecure.getRoleAdmin(ADMIN_DEFAULT_ROLE)).to.equal(ADMIN_ROLE);

      });
      it("Should rigth role ADMIN_ROLE for owner", async function () {
        const { scanSecure, owner } = await loadFixture(deployContextInit);
        expect(await scanSecure.hasRole(ADMIN_ROLE, owner.address)).to.equal(true);

      });

      it("Should rigth role MEMBER_ROLE for user", async function () {
        const { scanSecure, addr1 } = await loadFixture(deployContextRegistered);
        expect(await scanSecure.hasRole(MEMBER_ROLE, addr1.address)).to.equal(true);

      });

      it("Should rigth role CREATOR_ROLE for user", async function () {
        const { scanSecure, addr1, addr2 } = await loadFixture(deployContextAnswerCertification);
        expect(await scanSecure.hasRole(CREATOR_ROLE, addr1.address)).to.equal(true);
        expect(await scanSecure.hasRole(CREATOR_ROLE, addr2.address)).to.equal(false);

      });
    })

    describe("Event", function () {
      it("Should rigth event created", async function () {
        const { scanSecure, addr1 } = await loadFixture(deployContextCreateEvent);
        const { id, title, hash_ipfs, status, author } = await scanSecure.getEvent(0)

        expect(Number(id)).to.equal(0);
        expect(title).to.equal("Event1");
        expect(hash_ipfs).to.equal("hash_ipfs");
        expect(status).to.equal(0);
        expect(author).to.equal(addr1.address);

      });
    })

    describe("Tickets", function () {
      it("Should rigth tickets created", async function () {
        const { scanSecure, addr1 } = await loadFixture(deployContextCreateEvent);

        await scanSecure.connect(addr1).createTickets(0, 1000)

        expect(Number(await scanSecure.balanceOf(addr1.address, 0))).to.equal(1000)

      });
      it("Should rigth tickets transfered", async function () {
        const { scanSecure, addr1, addr2 } = await loadFixture(deployContextCreateTickets);

        await scanSecure.connect(addr1).safeTransferFrom(addr1.address, addr2.address, 0, 5, "0x00")

        console.log("transfered", await scanSecure.balanceOf(addr1.address, 0))
        console.log("transfered", await scanSecure.balanceOf(addr1.address, 1))

        expect(Number(await scanSecure.balanceOf(addr1.address, 0))).to.equal(995)
        expect(Number(await scanSecure.balanceOf(addr2.address, 0))).to.equal(5)

      });
      it("Should rigth tickets approved", async function () {
        const { scanSecure, addr1, addr2 } = await loadFixture(deployContextCreateTickets);

        await scanSecure.connect(addr1).safeTransferFrom(addr1.address, addr2.address, 0, 5, "0x00")

        console.log("transfered", await scanSecure.balanceOf(addr1.address, 0))
        console.log("transfered", await scanSecure.balanceOf(addr1.address, 1))

        expect(Number(await scanSecure.balanceOf(addr1.address, 0))).to.equal(995)
        expect(Number(await scanSecure.balanceOf(addr2.address, 0))).to.equal(5)

      });
    })
  });
});
