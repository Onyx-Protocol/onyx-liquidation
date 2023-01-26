import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import 'dotenv/config'
import { HardhatUserConfig } from 'hardhat/types'
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'
import 'hardhat-gas-reporter'

const privateKey = process.env.PRIVATE_KEY
const rpcUrl = process.env.RPC_URL

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    localhost: {
      url: 'http://localhost:8545',
    },
    goerli: {
      url: rpcUrl,
      accounts: [`${privateKey}`],
      gasMultiplier: 5,
    },
    mainnet: {
      url: rpcUrl,
      accounts: [`${privateKey}`],
      gasMultiplier: 5,
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.4.11',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.5.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
    user1: 1,
    liquidator: 2,
    user2: 3,
    weth_faucet: 9,
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    maxMethodDiff: 10,
  },
  mocha: {
    timeout: 0,
  },
  paths: {
    deploy: 'deploy/ethereum',
    sources: './contracts',
  },
}

export default config
