const hre = require('hardhat');
const ethers = hre.ethers;
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log("Deploying with", await deployer.getAddress())

  const NFTAuction = await ethers.getContractFactory("NFTAuction", deployer)
  //first arg what's the fee for the auction house, 1% - 100, 100% - 10000, range 1-10000 means 0.01% - 100%
  //second arg is the address of recipient of the auction fee
  const auction = await NFTAuction.deploy(0, address)
  await auction.deployed()

  saveFrontendFiles({
    NFTAuction: auction
  })
}

function saveFrontendFiles(contracts) {
  const contractsDir = path.join(__dirname, '/..', 'front/contracts')

  if(!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir)
  }

  Object.entries(contracts).forEach((contract_item) => {
    const [name, contract] = contract_item

    if(contract) {
      fs.writeFileSync(
        path.join(contractsDir, '/', name + '-contract-address.json'),
        JSON.stringify({[name]: contract.address}, undefined, 2)
      )
    }

    const ContractArtifact = hre.artifacts.readArtifactSync(name)

    fs.writeFileSync(
      path.join(contractsDir, '/', name + ".json"),
      JSON.stringify(ContractArtifact, null, 2)
    )
  })
}

 main()
   .then(() => process.exit(0))
   .catch((error) => {
     console.error(error)
     process.exit(1)
   })