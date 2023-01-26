import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import * as CONFIG from '../../config'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, execute, read } = deployments
  const { deployer } = await getNamedAccounts()
  const contracts = CONFIG[hre.network.name]

  const logic = await deploy('NFTLiquidationG1', {
    from: deployer,
    log: true,
    args: [],
  })

  const name = 'NFTLiquidationProxy'
  const [proxy, comptroller, oEther] = contracts || {}

  const proxyAddress = proxy
    ? proxy
    : (
        await deploy(name, {
          contract: 'NFTLiquidationProxy',
          from: deployer,
          // // gasPrice: '0x9502F900', // 2500000000 - 2.5
          // gasPrice: '0x2540BE400', // 10000000000 - 10
          log: true,
          args: [],
        })
      ).address

  if ((await read(name, 'nftLiquidationImplementation')).toLowerCase() != logic.address.toLowerCase()) {
    if ((await read(name, 'pendingNFTLiquidationImplementation')) != logic.address) {
      await execute(name, { from: deployer, log: true }, '_setPendingImplementation', logic.address)
    }
    await execute('NFTLiquidationG1', { from: deployer, log: true }, '_become', proxyAddress)
  }

  const impl = new hre.ethers.Contract(proxyAddress, logic.abi, await hre.ethers.provider.getSigner(deployer))

  // try {
  //   let tx = await impl.initialize()
  //   tx = await tx.wait()
  // } catch (e) {
  //   console.log(e)
  // }

  if (comptroller) {
    try {
      if ((await impl.comptroller()) != comptroller) {
        let tx = await impl._setComptroller(comptroller)
        tx = await tx.wait()
      }
    } catch (e) {
      let tx = await impl.initialize()
      tx = await tx.wait()
      tx = await impl._setComptroller(comptroller)
      tx = await tx.wait()
    }

    if ((await impl.oEther()) != oEther) {
      let tx = await impl.setOEther(oEther)
      tx = await tx.wait()
    }

    if ((await impl.protocolFeeRecipient()) != deployer) {
      let tx = await impl.setProtocolFeeRecipient(deployer)
      tx = await tx.wait()
    }

    if ((await impl.protocolFeeMantissa()) == '0') {
      let tx = await impl.setProtocolFeeMantissa('100000000000000000')
      tx = await tx.wait()
    }
  }
}

export default func
func.tags = ['liquidation']
func.dependencies = []
