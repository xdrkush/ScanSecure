const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat")

const ADMIN_DEFAULT_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000"
const MEMBER_ROLE = "0x829b824e2329e205435d941c9f13baf578548505283d29261236d8e6596d4636"
const CREATOR_ROLE = "0x828634d95e775031b9ff576b159a8509d3053581a8c9c4d7d86899e0afcd882f"
const ADMIN_ROLE = "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775"

describe("ScanSecure", function () {
  const calcFees = (_price) => {
    const fee = _price * 5 / 100;
    return {
      price: _price, fee,
      total: ethers.utils.parseEther((_price + fee).toString()),
    }
  }

  // Fixture
  async function deployContextInit() {
    // Get provider with signer
    const [owner, addr1, addr2, addr3, addr4, ownerUSDT] = await ethers.getSigners();

    // Déploiement du contrat
    const TetherToken = await ethers.getContractFactory("TetherToken", {
      signer: ownerUSDT
    });
    const tetherToken = await TetherToken.deploy('420000000');
    await tetherToken.deployed();

    const ScanSecure = await ethers.getContractFactory("ScanSecure");
    const scanSecure = await ScanSecure.deploy("ipfs://monsuperurl.io/", tetherToken.address);
    await scanSecure.deployed();

    const { deployedBytecode, bytecode } = await hre.artifacts.readArtifact("ScanSecure");
    const deploySize = Buffer.from(
      deployedBytecode.replace(/__\$\w*\$__/g, '0'.repeat(40)).slice(2),
      'hex'
    ).length;
    const initSize = Buffer.from(
      bytecode.replace(/__\$\w*\$__/g, '0'.repeat(40)).slice(2),
      'hex'
    ).length;

    console.log('SizeContract', deploySize, initSize)

    // Funding wallet
    await tetherToken.transfer(owner.address, 100000)
    await tetherToken.transfer(addr1.address, 15000)
    await tetherToken.transfer(addr2.address, 10000)
    await tetherToken.transfer(addr3.address, 5000)

    return { scanSecure, tetherToken, owner, addr1, addr2, addr3, addr4, ownerUSDT };
  };

  async function deployContextRegistered() {
    const { scanSecure, tetherToken, owner, addr1, addr2, addr3, addr4, ownerUSDT } = await loadFixture(deployContextInit);

    await scanSecure.connect(addr1).register('Addr1')
    await scanSecure.connect(addr2).register('Addr2')

    return { scanSecure, tetherToken, owner, addr1, addr2, addr3, addr4, ownerUSDT };
  };

  async function deployContextAskCertification() {
    const { scanSecure, tetherToken, owner, addr1, addr2, addr3, addr4, ownerUSDT } = await loadFixture(deployContextRegistered);

    await scanSecure.connect(addr1).askCertification("Ma super demande addr1")
    await scanSecure.connect(addr2).askCertification("Ma super demande addr2")

    return { scanSecure, tetherToken, owner, addr1, addr2, addr3, addr4, ownerUSDT };
  };

  async function deployContextAnswerCertification() {
    const { scanSecure, tetherToken, owner, addr1, addr2, addr3, addr4, ownerUSDT } = await loadFixture(deployContextAskCertification);

    await scanSecure.connect(owner).certificationAnswer(true, addr1.address)
    await scanSecure.connect(owner).certificationAnswer(false, addr2.address)

    return { scanSecure, tetherToken, owner, addr1, addr2, addr3, addr4, ownerUSDT };
  };

  async function deployContextCreateEvent() {
    const { scanSecure, tetherToken, owner, addr1, addr2, addr3, addr4, ownerUSDT } = await loadFixture(deployContextAnswerCertification);

    await scanSecure.connect(addr1).createEvent("Demo0")
    await scanSecure.connect(addr1).createEvent("Event1")
    await scanSecure.connect(addr1).createEvent("Event2")

    return { scanSecure, tetherToken, owner, addr1, addr2, addr3, addr4, ownerUSDT };
  };

  async function deployContextCreateTickets() {
    const { scanSecure, tetherToken, owner, addr1, addr2, addr3, addr4, ownerUSDT } = await loadFixture(deployContextCreateEvent);

    await scanSecure.connect(addr1).createTickets(0, 7, 7)
    await scanSecure.connect(addr1).createTickets(1, 1000, 20)
    await scanSecure.connect(addr1).createTickets(2, 500, 30)


    return { scanSecure, tetherToken, owner, addr1, addr2, addr3, addr4, ownerUSDT };
  };

  async function deployContextBuyTickets() {
    const { scanSecure, tetherToken, owner, addr1, addr2, addr3, addr4, ownerUSDT } = await loadFixture(deployContextCreateTickets);
    const quantity = 10

    await scanSecure.connect(addr1).setStatusEvent(1)
    await scanSecure.connect(addr1).setStatusEvent(2)

    const { price } = await scanSecure.getTicket(1, 0)
    const calc = calcFees(price * quantity)
    await tetherToken.allowance(addr2.address, scanSecure.address);
    await tetherToken.connect(addr2).approve(scanSecure.address, calc.total);
    await scanSecure.connect(addr2).buyTicket(1, quantity)

    const ticket2 = await scanSecure.getTicket(2, 0)
    const calc2 = calcFees(ticket2.price * quantity)
    await tetherToken.allowance(addr2.address, scanSecure.address);
    await tetherToken.connect(addr2).approve(scanSecure.address, calc2.total);
    await scanSecure.connect(addr2).buyTicket(2, quantity)


    return { scanSecure, tetherToken, owner, addr1, addr2, addr3, addr4, ownerUSDT };
  };

  describe("Deployment", function () {
    describe("Tether", function () {
      it("Should rigth ERC20 token (USDT)", async function () {
        const { tetherToken } = await loadFixture(deployContextInit);

        expect(await tetherToken.symbol()).to.equal("USDT");
        expect(await tetherToken.name()).to.equal("TETHER");

      });

      it("Should rigth balance with transfert token", async function () {
        const { tetherToken, owner, addr1, addr2, addr3, ownerUSDT } = await loadFixture(deployContextInit);

        expect(await tetherToken.balanceOf(ownerUSDT.address)).to.equal(419870000);
        expect(await tetherToken.balanceOf(owner.address)).to.equal(100000);
        expect(await tetherToken.balanceOf(addr1.address)).to.equal(15000);
        expect(await tetherToken.balanceOf(addr2.address)).to.equal(10000);
        expect(await tetherToken.balanceOf(addr3.address)).to.equal(5000);

      });
    })

    describe("Role", function () {
      it("Should rigth ADMIN_ROLE", async function () {
        const { scanSecure } = await loadFixture(deployContextInit);
        expect(await scanSecure.getRoleAdmin(ADMIN_DEFAULT_ROLE)).to.equal(ADMIN_ROLE);

        // console.log('edz',scanSecure, scanSecureTicketManager)

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
        const { title, status, author } = await scanSecure.getEvent(1);

        expect(title).to.equal("Event1");
        expect(status).to.equal(0);
        expect(author).to.equal(addr1.address);

      });
    })

    describe("Tickets", function () {
      it("Should rigth tickets created", async function () {
        const { scanSecure, addr1 } = await loadFixture(deployContextCreateEvent);

        await scanSecure.connect(addr1).createTickets(1, 1000, 20)

        expect(Number(await scanSecure.balanceOf(addr1.address, 1))).to.equal(1000)

      });
      it("Should rigth get ticket DEMO", async function () {
        const { scanSecure, addr1 } = await loadFixture(deployContextCreateTickets);

        // Demo
        const { isValid, price, owner } = await scanSecure.connect(addr1).getTicket(1, 0)
        expect(isValid).to.equal(false)
        expect(price).to.equal(20)
        expect(owner).to.equal(addr1.address)
        expect(Number(await scanSecure.balanceOf(addr1.address, 1))).to.equal(1000)

        const ticket2 = await scanSecure.connect(addr1).getTicket(2, 0)
        expect(ticket2.isValid).to.equal(false)
        expect(ticket2.price).to.equal(30)
        expect(ticket2.owner).to.equal(addr1.address)
        expect(Number(await scanSecure.balanceOf(addr1.address, 2))).to.equal(500)

      });

      it("Should rigth get ticket Buyed", async function () {
        const { scanSecure, addr2 } = await loadFixture(deployContextBuyTickets);

        // Ticket buyed
        const ticket = await scanSecure.connect(addr2).getTicket(1, 1)
        const ticketLast = await scanSecure.connect(addr2).getTicket(1, 10)

        // First
        expect(ticket.isValid).to.equal(true)
        expect(ticket.price).to.equal(20)
        expect(ticket.owner).to.equal(addr2.address)
        expect(Number(await scanSecure.balanceOf(addr2.address, 1))).to.equal(10)
        // Last
        expect(ticketLast.isValid).to.equal(true)
        expect(ticketLast.price).to.equal(20)
        expect(ticketLast.owner).to.equal(addr2.address)
        expect(Number(await scanSecure.balanceOf(addr2.address, 1))).to.equal(10)

      });


      it("Should rigth buy tickets", async function () {
        const { scanSecure, tetherToken, owner, addr1, addr2, ownerUSDT } = await loadFixture(deployContextCreateTickets);
        const quantity = 10

        await scanSecure.connect(addr1).setStatusEvent(1)
        await scanSecure.connect(addr1).setStatusEvent(2)

        const { price } = await scanSecure.getTicket(1, 0)
        const calc = calcFees(price * quantity)
        await tetherToken.connect(addr2).allowance(addr2.address, scanSecure.address);
        await tetherToken.connect(addr2).approve(scanSecure.address, calc.total);
        await scanSecure.connect(addr2).buyTicket(1, quantity)

        const ticket2 = await scanSecure.getTicket(2, 0)
        const calc2 = calcFees(ticket2.price * quantity)
        await tetherToken.connect(addr2).allowance(addr2.address, scanSecure.address);
        await tetherToken.connect(addr2).approve(scanSecure.address, calc2.total);
        await scanSecure.connect(addr2).buyTicket(2, quantity)

        // Contract
        expect(await tetherToken.balanceOf(scanSecure.address)).to.equal(25)
        // Owner (deployer contract)
        expect(await tetherToken.balanceOf(ownerUSDT.address)).to.equal(419870000)

        // Addr1 (seller)
        expect(await scanSecure.balanceOf(addr1.address, 1)).to.equal(990)
        expect(await scanSecure.balanceOf(addr1.address, 2)).to.equal(490)
        expect(await tetherToken.balanceOf(addr1.address)).to.equal(15500)

        // Addr2 (buyer)
        expect(await scanSecure.balanceOf(addr2.address, 1)).to.equal(10)
        expect(await scanSecure.balanceOf(addr2.address, 2)).to.equal(10)
        expect(await tetherToken.balanceOf(addr2.address)).to.equal(9475)

      });

      it("Should rigth recolt fee (sum by contract to owner)", async function () {
        const { scanSecure, tetherToken, owner, ownerUSDT } = await loadFixture(deployContextBuyTickets);

        await scanSecure.connect(owner).sumRecovery()

        expect(await tetherToken.balanceOf(owner.address)).to.equal(100025)
        expect(await tetherToken.balanceOf(ownerUSDT.address)).to.equal(419870000)
        expect(await tetherToken.balanceOf(scanSecure.address)).to.equal(0)
      });

      it("Should rigth consumed Ticket", async function () {
        const { scanSecure, addr2 } = await loadFixture(deployContextBuyTickets);

        await scanSecure.connect(addr2).consumeTicket(1, 1)
        await scanSecure.connect(addr2).consumeTicket(1, 2)

        const ticket = await scanSecure.getTicket(1, 1)
        expect(ticket.isValid).to.equal(false)
        expect(ticket.price).to.equal(20)
        expect(ticket.owner).to.equal(addr2.address)

        const ticket2 = await scanSecure.getTicket(1, 2)
        expect(ticket2.isValid).to.equal(false)
        expect(ticket2.price).to.equal(20)
        expect(ticket2.owner).to.equal(addr2.address)

      });

      // it("Should rigth offer ticket", async function () {
      //   const { scanSecure, addr2, addr3 } = await loadFixture(deployContextBuyTickets);

      //   await scanSecure.connect(addr2).offerTicket(addr3.address, 1, 1)

      //   const ticket = await scanSecure.getTicket(1, 1)
      //   expect(ticket.isValid).to.equal(true)
      //   expect(ticket.price).to.equal(20)
      //   expect(ticket.owner).to.equal(addr3.address)

      //   expect(await scanSecure.balanceOf(addr2.address, 1)).to.equal(9)
      //   expect(await scanSecure.balanceOf(addr3.address, 1)).to.equal(1)

      // });

    })
  });
});
