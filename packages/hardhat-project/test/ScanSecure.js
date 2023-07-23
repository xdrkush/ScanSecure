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
    const total = BigInt(_price + fee) * BigInt(10**18)

    return {
      price: _price, fee,
      total: ethers.utils.parseEther(total.toString()),
    }
  }

  // Fixture
  async function deployContextInit() {
    // Get provider with signer
    const [owner, addr1, addr2, addr3, addr4, ownerUSDT, creator2] = await ethers.getSigners();

    // Déploiement du contrat
    const TetherToken = await ethers.getContractFactory("TetherToken", {
      signer: ownerUSDT
    });
    const tetherToken = await TetherToken.deploy();
    await tetherToken.deployed();

    const ScanSecureERC1155 = await hre.ethers.getContractFactory("ScanSecureERC1155");
    const scanSecureERC1155 = await ScanSecureERC1155.deploy("ipfs://monsuperurl.io/");
    await scanSecureERC1155.deployed();

    const ScanSecure = await hre.ethers.getContractFactory("ScanSecure");
    const scanSecure = await ScanSecure.deploy(tetherToken.address, scanSecureERC1155.address);
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
    await tetherToken.transfer(owner.address, 1000000)
    await tetherToken.transfer(addr1.address, 150000)
    await tetherToken.transfer(addr2.address, 100000)
    await tetherToken.transfer(addr3.address, 5000)
    await tetherToken.transfer(addr4.address, 5000)

    return { ScanSecure, scanSecure, tetherToken, scanSecureERC1155, owner, addr1, addr2, addr3, addr4, ownerUSDT, creator2 };
  };

  async function deployContextRegistered() {
    const { ScanSecure, scanSecure, tetherToken, scanSecureERC1155, owner, addr1, addr2, addr3, addr4, ownerUSDT, creator2 } = await loadFixture(deployContextInit);

    await scanSecure.connect(addr1).register('Addr1')
    await scanSecure.connect(addr2).register('Addr2')
    await scanSecure.connect(addr3).register('Addr2')
    await scanSecure.connect(creator2).register('Creator2')

    return { ScanSecure, scanSecure, tetherToken, scanSecureERC1155, owner, addr1, addr2, addr3, addr4, ownerUSDT, creator2 };
  };

  async function deployContextAskCertification() {
    const { ScanSecure, scanSecure, tetherToken, scanSecureERC1155, owner, addr1, addr2, addr3, addr4, ownerUSDT, creator2 } = await loadFixture(deployContextRegistered);

    await scanSecure.connect(addr1).askCertification("Ma super demande addr1")
    await scanSecure.connect(addr2).askCertification("Ma super demande addr2")
    await scanSecure.connect(addr3).askCertification("Ma super demande addr2")
    await scanSecure.connect(creator2).askCertification("Ma super demande creator2")

    return { ScanSecure, scanSecure, tetherToken, scanSecureERC1155, owner, addr1, addr2, addr3, addr4, ownerUSDT, creator2 };
  };

  async function deployContextAnswerCertification() {
    const { ScanSecure, scanSecure, tetherToken, scanSecureERC1155, owner, addr1, addr2, addr3, addr4, ownerUSDT, creator2 } = await loadFixture(deployContextAskCertification);

    await scanSecure.connect(owner).certificationAnswer(true, addr1.address)
    await scanSecure.connect(owner).certificationAnswer(true, creator2.address)
    await scanSecure.connect(owner).certificationAnswer(false, addr2.address)

    return { ScanSecure, scanSecure, tetherToken, scanSecureERC1155, owner, addr1, addr2, addr3, addr4, ownerUSDT, creator2 };
  };

  async function deployContextCreateEvent() {
    const { ScanSecure, scanSecure, tetherToken, scanSecureERC1155, owner, addr1, addr2, addr3, addr4, ownerUSDT, creator2 } = await loadFixture(deployContextAnswerCertification);

    await scanSecure.connect(addr1).createEvent("Demo0")
    await scanSecure.connect(addr1).createEvent("Event1")
    await scanSecure.connect(addr1).createEvent("Event2")

    return { ScanSecure, scanSecure, tetherToken, scanSecureERC1155, owner, addr1, addr2, addr3, addr4, ownerUSDT, creator2 };
  };

  async function deployContextCreateTickets() {
    const { ScanSecure, scanSecure, tetherToken, scanSecureERC1155, owner, addr1, addr2, addr3, addr4, ownerUSDT, creator2 } = await loadFixture(deployContextCreateEvent);

    await scanSecure.connect(addr1).createTickets(0, 7, 7)
    await scanSecure.connect(addr1).createTickets(1, 1000, 20)
    await scanSecure.connect(addr1).createTickets(2, 500, 30)

    await scanSecureERC1155.connect(addr1).setApprovalForAll(scanSecure.address, true)

    return { ScanSecure, scanSecure, tetherToken, scanSecureERC1155, owner, addr1, addr2, addr3, addr4, ownerUSDT, creator2 };
  };

  async function deployContextBuyTickets() {
    const { ScanSecure, scanSecure, tetherToken, scanSecureERC1155, owner, addr1, addr2, addr3, addr4, ownerUSDT, creator2 } = await loadFixture(deployContextCreateTickets);
    const quantity = 10

    await scanSecure.connect(addr1).setStatusEvent(1)
    await scanSecure.connect(addr1).setStatusEvent(2)

    const { price } = await scanSecure.getTicket(1, 0)
    const calc = calcFees(price * quantity)
    await tetherToken.allowance(addr2.address, scanSecure.address);
    await tetherToken.connect(addr2).approve(scanSecure.address, calc.total);
    await scanSecure.connect(addr2).buyTicket(1, quantity)

    await tetherToken.allowance(addr3.address, scanSecure.address);
    await tetherToken.connect(addr3).approve(scanSecure.address, calc.total);
    await scanSecure.connect(addr3).buyTicket(1, quantity)

    const ticket2 = await scanSecure.getTicket(2, 0)
    const calc2 = calcFees(ticket2.price * quantity)
    await tetherToken.allowance(addr2.address, scanSecure.address);
    await tetherToken.connect(addr2).approve(scanSecure.address, calc2.total);
    await scanSecure.connect(addr2).buyTicket(2, quantity)

    return { ScanSecure, scanSecure, tetherToken, scanSecureERC1155, owner, addr1, addr2, addr3, addr4, ownerUSDT, creator2 };
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

        expect(String(await tetherToken.balanceOf(ownerUSDT.address))).to.equal("419999999999999999998740000");
        expect(await tetherToken.balanceOf(owner.address)).to.equal(1000000);
        expect(await tetherToken.balanceOf(addr1.address)).to.equal(150000);
        expect(await tetherToken.balanceOf(addr2.address)).to.equal(100000);
        expect(await tetherToken.balanceOf(addr3.address)).to.equal(5000);

      });
    })

    describe("ScanSecure", async function () {

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

      describe("Access", function () {
        it("Register with pseudo empty", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextInit);
          await expect(scanSecure.connect(addr1).register(""))
            .to.be.revertedWith("The pseudo is empty")
        });
        it("Register with user already member", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextRegistered);
          await expect(scanSecure.connect(addr1).register("toto"))
            .to.be.revertedWith("You are already registred on member")
        });
        it("Register -> Event Whitelisted", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextInit);
          await expect(scanSecure.connect(addr1).register("toto"))
            .to.emit(scanSecure, "Whitelisted")
            .withArgs(addr1.address);
        });

        it("AskCertification with no member", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextInit);
          await expect(scanSecure.connect(addr1).askCertification("toto"))
            .to.be.revertedWith(`AccessControl: account ${addr1.address.toLowerCase()} is missing role ${MEMBER_ROLE}`)
        });
        it("AskCertification with user already creator | pending", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextAskCertification);
          await expect(scanSecure.connect(addr1).askCertification("Ma super demande"))
            .to.be.revertedWith("You are already ask certification")
        });
        it("AskCertification -> Event AskCertification", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextRegistered);
          const message = "Mon Super Message"
          await expect(scanSecure.connect(addr1).askCertification(message))
            .to.emit(scanSecure, "AskCertification")
            .withArgs(addr1.address, message);
        });

        it("CertificationAnswer with user not ADMIN_ROLE", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextAskCertification);
          await expect(scanSecure.connect(addr1).certificationAnswer(true, addr1.address))
            .to.be.revertedWith(`AccessControl: account ${addr1.address.toLowerCase()} is missing role ${ADMIN_ROLE}`)
        });
        it("CertificationAnswer with user not ADMIN_ROLE", async function () {
          const { scanSecure, owner, addr4 } = await loadFixture(deployContextAskCertification);
          await expect(scanSecure.connect(owner).certificationAnswer(true, addr4.address))
            .to.be.revertedWith(`The user are not status asker`)
        });
        it("CertificationAnswer -> Event ", async function () {
          const { scanSecure, owner, addr1 } = await loadFixture(deployContextAskCertification);
          await expect(scanSecure.connect(owner).certificationAnswer(true, addr1.address))
            .to.emit(scanSecure, "Certified")
            .withArgs(addr1.address, 2);
        });

        it("getUser", async function () {
          const { scanSecure, addr4 } = await loadFixture(deployContextAskCertification);
          await expect(scanSecure.connect(addr4).getUser(addr4.address))
            .to.be.revertedWith(`User not exist`)
        });
        it("getUser no exist", async function () {
          const { scanSecure, addr1, addr3 } = await loadFixture(deployContextAskCertification);
          const { pseudo, status } = await scanSecure.connect(addr3).getUser(addr1.address)
          expect(pseudo).to.equal("Addr1");
          expect(status).to.equal(1);
        });
      })

      describe("Event", function () {
        it("CreateEvent : Should rigth event created", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextAnswerCertification);

          await scanSecure.connect(addr1).createEvent("Test0")
          await scanSecure.connect(addr1).createEvent("Test1")
          const { title, status, author } = await scanSecure.getEvent(1);

          expect(title).to.equal("Test1");
          expect(status).to.equal(0);
          expect(author).to.equal(addr1.address);

        });
        it("CreateEvent : Should rigth error with no CREATOR_ROLE", async function () {
          const { scanSecure, addr2 } = await loadFixture(deployContextAnswerCertification);
          await expect(scanSecure.connect(addr2).createEvent("Test0"))
            .to.be.revertedWith(`AccessControl: account ${addr2.address.toLowerCase()} is missing role ${CREATOR_ROLE}`)
        });
        it("CreateEvent : Should rigth error title is empty", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextCreateEvent);
          await expect(scanSecure.connect(addr1).createEvent(""))
            .to.be.revertedWith(`Title null is not accepted`)
        });
        it("CreateEvent -> Event EventCreated", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextAnswerCertification);

          await scanSecure.connect(addr1).createEvent("Test1")
          await expect(scanSecure.connect(addr1).createEvent("Test2"))
            .to.emit(scanSecure, "EventCreated")
            .withArgs(2, addr1.address);

        });

        it("SetStatusEvent : Should rigth set status", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextCreateEvent);

          // First set status
          await scanSecure.connect(addr1).setStatusEvent(1)
          const event = await scanSecure.getEvent(1)
          expect(event.title).to.equal("Event1");
          expect(event.author).to.equal(addr1.address);
          expect(event.status).to.equal(1);

          // Second set status
          await scanSecure.connect(addr1).setStatusEvent(1)
          const eventS = await scanSecure.getEvent(1)
          expect(eventS.title).to.equal("Event1");
          expect(eventS.author).to.equal(addr1.address);
          expect(eventS.status).to.equal(2);
        });
        it("SetStatusEvent : Should rigth error not creator of event", async function () {
          const { scanSecure, addr2 } = await loadFixture(deployContextCreateEvent);
          await expect(scanSecure.connect(addr2).setStatusEvent(1))
            .to.be.revertedWith(`You are not creator of event`)
        });
        it("SetStatusEvent : Should rigth error event closed", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextCreateTickets);
          scanSecure.connect(addr1).setStatusEvent(1)
          scanSecure.connect(addr1).setStatusEvent(1)
          scanSecure.connect(addr1).setStatusEvent(1)
          scanSecure.connect(addr1).setStatusEvent(1)
          
          await expect(scanSecure.connect(addr1).setStatusEvent(1))
            .to.be.revertedWith(`Event closed`)
        });
        it("SetStatusEvent -> Event EventStatusChanged", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextCreateEvent);

          await expect(scanSecure.connect(addr1).setStatusEvent(1))
            .to.emit(scanSecure, "EventStatusChanged")
            .withArgs(1, 0, 1);

        });

        it("GetEvent : Should rigth event", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextCreateEvent);
          const event = await scanSecure.getEvent(1)
          expect(event.title).to.equal("Event1");
          expect(event.author).to.equal(addr1.address);
          expect(event.status).to.equal(0);
        });
        it("GetEvent : Should are error event no exist", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextCreateEvent);

          await expect(scanSecure.getEvent(5))
            .to.be.revertedWith("Event not exist")

        });
      })

      describe("Tickets", function () {
        it("CreateTickets : Should rigth tickets created", async function () {
          const { scanSecure, scanSecureERC1155, addr1 } = await loadFixture(deployContextCreateEvent);
          await scanSecure.connect(addr1).createTickets(1, 1000, 20)
          expect(Number(await scanSecureERC1155.balanceOf(addr1.address, 1))).to.equal(1000)
        });
        it("CreateTickets -> Event NewTickets", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextCreateEvent);
          const quantity = 1000

          await expect(scanSecure.connect(addr1).createTickets(1, quantity, 20))
            .to.emit(scanSecure, "NewTickets")
            .withArgs(1, quantity, addr1.address);
        });
        it("CreateTickets : Should error no price | quantity", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextCreateEvent);
          await expect(scanSecure.connect(addr1).createTickets(1, 0, 20))
            .to.be.revertedWith("Not rigth price or quantity")
        });
        it("CreateTickets : Should error event no exist", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextCreateEvent);
          await expect(scanSecure.connect(addr1).createTickets(5, 200, 20))
            .to.be.revertedWith("Event not exist")
        });
        it("CreateTickets : Should error no CREATOR_ROLE", async function () {
          const { scanSecure, addr2 } = await loadFixture(deployContextCreateEvent);
          await expect(scanSecure.connect(addr2).createTickets(1, 1000, 20))
            .to.be.revertedWith(`AccessControl: account ${addr2.address.toLowerCase()} is missing role ${CREATOR_ROLE}`)
        });
        it("CreateTickets : Should error no author", async function () {
          const { scanSecure, creator2 } = await loadFixture(deployContextCreateEvent);
          await expect(scanSecure.connect(creator2).createTickets(1, 1000, 20))
            .to.be.revertedWith("You are not author of event")
        });

        it("GetTicket : Should rigth get ticket DEMO", async function () {
          const { scanSecure, scanSecureERC1155, addr1, addr2 } = await loadFixture(deployContextCreateTickets);

          // Demo
          const ticket = await scanSecure.connect(addr1).getTicket(1, 0)
          expect(ticket.status).to.equal(0)
          expect(ticket.price).to.equal(20)
          expect(ticket.owner).to.equal(addr1.address)
          expect(Number(await scanSecureERC1155.balanceOf(addr1.address, 1))).to.equal(1000)

          const ticket2 = await scanSecure.connect(addr1).getTicket(2, 0)
          expect(ticket2.status).to.equal(0)
          expect(ticket2.price).to.equal(30)
          expect(ticket2.owner).to.equal(addr1.address)
          expect(Number(await scanSecureERC1155.balanceOf(addr1.address, 2))).to.equal(500)

        });
        it("GetTicket : Should rigth get ticket Buyed", async function () {
          const { scanSecure, scanSecureERC1155, addr2 } = await loadFixture(deployContextBuyTickets);

          // Ticket buyed
          const ticket = await scanSecure.connect(addr2).getTicket(1, 1)
          const ticketLast = await scanSecure.connect(addr2).getTicket(1, 10)

          // First
          expect(ticket.status).to.equal(0)
          expect(ticket.price).to.equal(20)
          expect(ticket.owner).to.equal(addr2.address)
          expect(Number(await scanSecureERC1155.balanceOf(addr2.address, 1))).to.equal(10)
          // Last
          expect(ticketLast.status).to.equal(0)
          expect(ticketLast.price).to.equal(20)
          expect(ticketLast.owner).to.equal(addr2.address)
          expect(Number(await scanSecureERC1155.balanceOf(addr2.address, 1))).to.equal(10)

        });
        it("GetTickets : Should rigth get tickets", async function () {
          const { scanSecure, addr2 } = await loadFixture(deployContextBuyTickets);
          // Tickets buyed
          const tickets = await scanSecure.connect(addr2).getTickets(1, addr2.address)
          expect(tickets.length).to.equal(10)

        });
        it("GetTicket : Should error ticket not exist", async function () {
          const { scanSecure, addr2 } = await loadFixture(deployContextBuyTickets);
          await expect(scanSecure.connect(addr2).getTicket(1, 5000))
            .to.be.revertedWith("Ticket not exist")
        });

        it("BuyTicket : Should rigth buy tickets", async function () {
          const { scanSecure, tetherToken, scanSecureERC1155, addr1, addr2, ownerUSDT } = await loadFixture(deployContextCreateTickets);
          const quantity = 100

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
          expect(await tetherToken.balanceOf(scanSecure.address)).to.equal(250)
          // Owner (deployer contract)
          expect(String(await tetherToken.balanceOf(ownerUSDT.address))).to.equal("419999999999999999998740000");

          // Addr1 (seller)
          expect(await scanSecureERC1155.balanceOf(addr1.address, 1)).to.equal(900)
          expect(await scanSecureERC1155.balanceOf(addr1.address, 2)).to.equal(400)
          expect(await tetherToken.balanceOf(addr1.address)).to.equal(155000)

          // Addr2 (buyer)
          expect(await scanSecureERC1155.balanceOf(addr2.address, 1)).to.equal(100)
          expect(await scanSecureERC1155.balanceOf(addr2.address, 2)).to.equal(100)
          expect(await tetherToken.balanceOf(addr2.address)).to.equal(94750)

        });
        it("BuyTicket : Should error no member", async function () {
          const { scanSecure, tetherToken, addr1, addr4 } = await loadFixture(deployContextCreateTickets);
          const { price } = await scanSecure.getTicket(1, 0)

          await scanSecure.connect(addr1).setStatusEvent(1)
          await tetherToken.connect(addr4).allowance(addr4.address, scanSecure.address);
          await tetherToken.connect(addr4).approve(scanSecure.address, calcFees(price * 1).total);

          await expect(scanSecure.connect(addr4).buyTicket(1, 1))
            .to.be.revertedWith(`No Buyer`)
        });
        it("BuyTicket : Should error event not exist", async function () {
          const { scanSecure, tetherToken, addr2 } = await loadFixture(deployContextCreateTickets);
          const { price } = await scanSecure.getTicket(1, 0)
          await tetherToken.connect(addr2).allowance(addr2.address, scanSecure.address);
          await tetherToken.connect(addr2).approve(scanSecure.address, calcFees(price * 1).total);
          await expect(scanSecure.connect(addr2).buyTicket(5, 1))
            .to.be.revertedWith("Event not exist")
        });
        it("BuyTicket : Should rigth buy tickets SOLD OUT", async function () {
          const { scanSecure, tetherToken, scanSecureERC1155, addr1, addr2, ownerUSDT } = await loadFixture(deployContextCreateTickets);
          const quantity = 100, nbrTxs = 10;

          await scanSecure.connect(addr1).setStatusEvent(1)
          await scanSecure.connect(addr1).setStatusEvent(2)

          const { price } = await scanSecure.getTicket(1, 0)
          const calc = calcFees(price * quantity)

          for (let i = 0; i < nbrTxs; i++) {
            await tetherToken.connect(addr2).allowance(addr2.address, scanSecure.address);
            await tetherToken.connect(addr2).approve(scanSecure.address, calc.total);
            await scanSecure.connect(addr2).buyTicket(1, quantity)
          }

          // Tx failed (out of limit ticket on event)
          await tetherToken.connect(addr2).allowance(addr2.address, scanSecure.address);
          await tetherToken.connect(addr2).approve(scanSecure.address, calcFees(price * 1).total);
          await expect(scanSecure.connect(addr2).buyTicket(1, 1))
            .to.be.revertedWith("Sold Out")

          // Contract
          expect(await tetherToken.balanceOf(scanSecure.address)).to.equal(1000)
          // Owner (deployer contract)
          expect(String(await tetherToken.balanceOf(ownerUSDT.address))).to.equal("419999999999999999998740000");

          // Addr1 (seller)
          expect(await scanSecureERC1155.balanceOf(addr1.address, 1)).to.equal(0)
          expect(await tetherToken.balanceOf(addr1.address)).to.equal(170000)

        });
        it("BuyTicket : Should error event no more ticket", async function () {
          const { scanSecure, tetherToken, addr1, addr2 } = await loadFixture(deployContextCreateTickets);
          const quantity = 90, nbrTxs = 11;
          const { price } = await scanSecure.getTicket(1, 0)
          const calc = calcFees(price * quantity)

          await scanSecure.connect(addr1).setStatusEvent(1)

          for (let i = 0; i < nbrTxs; i++) {
            await tetherToken.connect(addr2).allowance(addr2.address, scanSecure.address);
            await tetherToken.connect(addr2).approve(scanSecure.address, calc.total);
            await scanSecure.connect(addr2).buyTicket(1, quantity)
          }

          await tetherToken.connect(addr2).allowance(addr2.address, scanSecure.address);
          await tetherToken.connect(addr2).approve(scanSecure.address, calcFees(price * 50).total);
          await expect(scanSecure.connect(addr2).buyTicket(1, 50))
            .to.be.revertedWith("No more ticket")
        });
        it("BuyTicket : Should error out of limit group ticket", async function () {
          const { scanSecure, tetherToken, addr2 } = await loadFixture(deployContextCreateTickets);
          const { price } = await scanSecure.getTicket(1, 0)
          await tetherToken.connect(addr2).allowance(addr2.address, scanSecure.address);
          await tetherToken.connect(addr2).approve(scanSecure.address, calcFees(price * 1).total);
          await expect(scanSecure.connect(addr2).buyTicket(1, 101))
            .to.be.revertedWith("Quantity should be between zero & 100")
        });
        it("BuyTicket : Should error user have not balance", async function () {
          const { scanSecure, tetherToken, addr1, addr3 } = await loadFixture(deployContextCreateTickets);
          const quantity = 95, nbrTxs = 2;
          const { price } = await scanSecure.getTicket(1, 0)
          const calc = calcFees(price * quantity)

          await scanSecure.connect(addr1).setStatusEvent(1)

          for (let i = 0; i < nbrTxs; i++) {
            await tetherToken.connect(addr3).allowance(addr3.address, scanSecure.address);
            await tetherToken.connect(addr3).approve(scanSecure.address, calc.total);
            await scanSecure.connect(addr3).buyTicket(1, quantity)
          }

          await tetherToken.connect(addr3).allowance(addr3.address, scanSecure.address);
          await tetherToken.connect(addr3).approve(scanSecure.address, calcFees(price * 1).total);
          await expect(scanSecure.connect(addr3).buyTicket(1, 100))
            .to.be.revertedWith("Not fund")
        });
        it("BuyTicket : Should error not approval", async function () {
          const { scanSecure, scanSecureERC1155, tetherToken, addr1, addr2, addr3, creator2 } = await loadFixture(deployContextCreateTickets);
          const { price } = await scanSecure.getTicket(1, 0)

          await scanSecure.connect(creator2).createEvent("TestApproval")
          await scanSecure.connect(creator2).createTickets(3, 1000, 35)
          await scanSecure.connect(creator2).setStatusEvent(3)

          await tetherToken.connect(addr3).allowance(addr3.address, scanSecure.address);
          await tetherToken.connect(addr3).approve(scanSecure.address, calcFees(price * 1).total);

          await expect(scanSecure.connect(addr3).buyTicket(3, 100))
            .to.be.revertedWith("Contract not approved to spend ticket")
        });

        it("SumRecovery : Should rigth recolt fee (sum by contract to owner)", async function () {
          const { scanSecure, tetherToken, owner, ownerUSDT } = await loadFixture(deployContextBuyTickets);

          await scanSecure.connect(owner).sumRecovery()

          expect(await tetherToken.balanceOf(owner.address)).to.equal(1000035)
          expect(String(await tetherToken.balanceOf(ownerUSDT.address))).to.equal("419999999999999999998740000");
          expect(await tetherToken.balanceOf(scanSecure.address)).to.equal(0)
        });
        it("SumRecovery -> Event SumRecovered", async function () {
          const { scanSecure, tetherToken, owner } = await loadFixture(deployContextBuyTickets);
          const sumTotal = await tetherToken.balanceOf(scanSecure.address);
          await expect(scanSecure.connect(owner).sumRecovery())
            .to.emit(scanSecure, "SumRecovered")
            .withArgs(sumTotal, owner.address);
        });
        it("SumRecovery : Should error no ADMIN_ROLE", async function () {
          const { scanSecure, addr2 } = await loadFixture(deployContextBuyTickets);
          await expect(scanSecure.connect(addr2).sumRecovery())
            .to.be.revertedWith(`AccessControl: account ${addr2.address.toLowerCase()} is missing role ${ADMIN_ROLE}`)
        });

        it("ConsumeTicket : Should rigth consumed Ticket", async function () {
          const { scanSecure, addr2 } = await loadFixture(deployContextBuyTickets);

          await scanSecure.connect(addr2).consumeTicket(1, 1)
          await scanSecure.connect(addr2).consumeTicket(1, 2)

          const ticket = await scanSecure.getTicket(1, 1)
          expect(ticket.status).to.equal(1)
          expect(ticket.price).to.equal(20)
          expect(ticket.owner).to.equal(addr2.address)

          const ticket2 = await scanSecure.getTicket(1, 2)
          expect(ticket2.status).to.equal(1)
          expect(ticket2.price).to.equal(20)
          expect(ticket2.owner).to.equal(addr2.address)

        });
        it("ConsumeTicket -> Event TicketConsumed", async function () {
          const { scanSecure, addr2 } = await loadFixture(deployContextBuyTickets);
          await expect(scanSecure.connect(addr2).consumeTicket(1, 2))
            .to.emit(scanSecure, "TicketConsumed")
            .withArgs(1, 2, addr2.address);
        });
        it("ConsumeTicket : Should error ticket not exist", async function () {
          const { scanSecure, addr1 } = await loadFixture(deployContextBuyTickets);
          await expect(scanSecure.connect(addr1).consumeTicket(1, 5000))
            .to.be.revertedWith(`Ticket not exist`)
        });
        it("ConsumeTicket : Should error You dont have a ticket", async function () {
          const { scanSecure, addr4 } = await loadFixture(deployContextBuyTickets);
          await expect(scanSecure.connect(addr4).consumeTicket(1, 2))
            .to.be.revertedWith(`You dont have a ticket`)
        });
        it("ConsumeTicket : Should error you ticket consumed", async function () {
          const { scanSecure, addr2 } = await loadFixture(deployContextBuyTickets);
          scanSecure.connect(addr2).consumeTicket(1, 2)
          await expect(scanSecure.connect(addr2).consumeTicket(1, 2))
            .to.be.revertedWith(`Ticket consumed`)
        });
        it("ConsumeTicket : Should error user not owner of ticket", async function () {
          const { scanSecure, addr2 } = await loadFixture(deployContextBuyTickets);
          await expect(scanSecure.connect(addr2).consumeTicket(1, 11))
            .to.be.revertedWith(`You are not owner on ticket`)
        });


        it("OfferTicket : Should rigth offer ticket", async function () {
          const { scanSecure, scanSecureERC1155, addr1, addr2, creator2, addr3 } = await loadFixture(deployContextBuyTickets);

          await scanSecureERC1155.connect(addr2).setApprovalForAll(scanSecure.address, true)
          await scanSecure.connect(addr2).offerTicket(creator2.address, 1, 1)
          await scanSecure.connect(addr2).offerTicket(creator2.address, 1, 2)

          await scanSecureERC1155.connect(creator2).setApprovalForAll(scanSecure.address, true)
          await scanSecure.connect(creator2).offerTicket(addr3.address, 1, 1)

          const ticket = await scanSecure.getTicket(1, 1)
          expect(ticket.status).to.equal(0)
          expect(ticket.price).to.equal(20)
          expect(ticket.owner).to.equal(addr3.address)

          expect(await scanSecureERC1155.balanceOf(addr1.address, 1)).to.equal(980)
          expect(await scanSecureERC1155.balanceOf(creator2.address, 1)).to.equal(1)
          expect(await scanSecureERC1155.balanceOf(addr2.address, 1)).to.equal(8)
          expect(await scanSecureERC1155.balanceOf(addr3.address, 1)).to.equal(11)

        });
        it("OfferTicket -> Event TicketOwnered", async function () {
          const { scanSecure, scanSecureERC1155, addr2, creator2 } = await loadFixture(deployContextBuyTickets);
          await scanSecureERC1155.connect(addr2).setApprovalForAll(scanSecure.address, true)
          await expect(scanSecure.connect(addr2).offerTicket(creator2.address, 1, 1))
            .to.emit(scanSecure, "TicketOwnered")
            .withArgs(1, 1, creator2.address);
        });
        it("OfferTicket : Should error ticket not exist", async function () {
          const { scanSecure, scanSecureERC1155, addr1, addr3 } = await loadFixture(deployContextBuyTickets);
          await scanSecureERC1155.connect(addr1).setApprovalForAll(scanSecure.address, true)
          await expect(scanSecure.connect(addr1).offerTicket(addr3.address, 5, 1))
            .to.be.revertedWith(`Ticket not exist`)
        });
        it("OfferTicket : Should error user dont have a ticket", async function () {
          const { scanSecure, scanSecureERC1155, creator2, addr3 } = await loadFixture(deployContextBuyTickets);
          await scanSecureERC1155.connect(creator2).setApprovalForAll(scanSecure.address, true)
          await expect(scanSecure.connect(creator2).offerTicket(addr3.address, 1, 1))
            .to.be.revertedWith(`You dont have a ticket`)
        });
        it("OfferTicket : Should error user not owner of ticket", async function () {
          const { scanSecure, scanSecureERC1155, addr3 } = await loadFixture(deployContextBuyTickets);
          await scanSecureERC1155.connect(addr3).setApprovalForAll(scanSecure.address, true)
          await expect(scanSecure.connect(addr3).offerTicket(addr3.address, 1, 1))
            .to.be.revertedWith(`You are not owner on ticket`)
        });

      })

    })

    describe("ScanSecureERC1155", function () {
      describe("ERC1155", function () {
        it("Should rigth ERC1155 TicketManager", async function () {
          const { scanSecureERC1155, owner } = await loadFixture(deployContextInit);
          expect(await scanSecureERC1155.owner()).to.equal(owner.address);
        });
      })
    })

  });
});
