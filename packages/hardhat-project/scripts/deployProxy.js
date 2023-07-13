// scripts/create-box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const ScanSecure = await ethers.getContractFactory("ScanSecure");
  const box = await upgrades.deployProxy(ScanSecure);
  await box.waitForDeployment();
  console.log("Box deployed to:", await box.getAddress());
}

main();