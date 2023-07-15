// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    // Deploy ScanSecure

    // const TetherToken = await hre.ethers.getContractFactory("TetherToken");
    // const tetherToken = await TetherToken.deploy(420000000);
    
    // await tetherToken.deployed();
    
    // console.log(
    //   `TetherToken deployed to ${tetherToken.address}`
    // );

    const ScanSecure = await hre.ethers.getContractFactory("ScanSecure");
    const scanSecure = await ScanSecure.deploy("ipfs://monurl.com/<id>.json");
    
    await scanSecure.deployed();
    
    console.log(
      `ScanSecure deployed to ${scanSecure.address}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
