require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
// require('@openzeppelin/hardhat-upgrades');
require('hardhat-docgen');

const { INFURA_API_KEY, ETH_PRIVATE_KEY } = process.env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{
      version: "0.8.19"
    }, {
      version: "0.4.17",
    }]
  },
  networks: {
    hardhat: {
      blockGasLimit: 30000000 // ! Default 30_000_000
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${ETH_PRIVATE_KEY}`]
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${ETH_PRIVATE_KEY}`]
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${ETH_PRIVATE_KEY}`]
    }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  gasReporter: {
    enabled: false,
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [':ERC20$'],
  }
};
