// scripts/upgrade-box.js
const { ethers, upgrades } = require("hardhat");

const FROM_ADDRESS = "0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690"

async function main() {
  const ScanSecureV2 = await ethers.getContractFactory("ScanSecureV2");
  const box = await upgrades.upgradeProxy(FROM_ADDRESS, ScanSecureV2);
  console.log("Box upgraded", box);
}

main();