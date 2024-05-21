require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
const { PRIVATE_KEY } = process.env;
module.exports = {
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {},
    opBnb: {
      url: "https://opbnb-testnet.publicnode.com",
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {},
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "../artifacts",
  },
};
