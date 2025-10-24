import 'dotenv/config';
import '@nomicfoundation/hardhat-toolbox';

export default {
  solidity: { compilers: [{ version: '0.8.20' }] },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {},
    // goerli: {
    //   url: process.env.ALCHEMY_URL,
    //   accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    // },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
};