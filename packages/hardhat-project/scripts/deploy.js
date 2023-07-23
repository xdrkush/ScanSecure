// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const SizeContract = async (_name) => {
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
}

async function main() {
  const TetherToken = await hre.ethers.getContractFactory("TetherToken");
  const tetherToken = await TetherToken.deploy();
  await tetherToken.deployed();
  console.log(
    `TetherToken deployed to ${tetherToken.address}`
  );

  console.log('test1', tetherToken)

  const ScanSecureERC1155 = await hre.ethers.getContractFactory("ScanSecureERC1155");
  const scanSecureERC1155 = await ScanSecureERC1155.deploy("ipfs://monsuperurl.io/");
  await scanSecureERC1155.deployed();
  console.log(
    `ScanSecureERC1155 deployed to ${scanSecureERC1155.address}`
  );

  const ScanSecure = await hre.ethers.getContractFactory("ScanSecure");
  const scanSecure = await ScanSecure.deploy(tetherToken.address, scanSecureERC1155.address);
  await scanSecure.deployed();
  console.log(
    `ScanSecure deployed to ${scanSecure.address}`
  );

  
  SizeContract("ScanSecure")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
