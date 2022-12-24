import React, { Component } from "react"
import { ethers } from 'ethers'

import { ConnectWallet } from "../components/ConnectWallet"

import auctionAddress from '../contracts/DutchAuction-contract-address.json'
import auctionArtifect from '../contracts/DutchAuction.json' 

const HARDHAT_NETWORK_ID = '1337'
const ERROR_CODE_TXREJECTED_BY_USER = 4001

export default class extends Component {
  constructor(props) {
    super(props)

    this.initialState = {
      selectedAccount: null,
      txBeingSent: null,
      networkError: null,
      transactionError: null,
      balance: null,
      currentPrice: null
    }

    this.state = this.initialState
  }

  _connectWallet = async () => {
    if(window.ethereum === undefined) {
      this.setState({
        networkError: 'Please install Metamask!'
      })
      return
    }

    const [selectedAddress] = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })

    if(!this._checkNetwork()) { return }

    this._initialize(selectedAddress)

    window.ethereum.on('accountsChanged', ([newAddress]) => {
      if(newAddress == undefined) {
        return this._resetState()
      }

      this._initialize(newAddress)
      })

      window.ethereum.on('chainChanged', ([networkId]) => {
        this._resetState()
    })
  }

  async _initialize(selectedAddress) {
    this._provider = new ethers.providers.Web3Provider(window.ethereum)

    this._auction = new ethers.Contract(
      auctionAddress.DutchAuction,
      auctionArtifect.abi,
      this._provider.getSigner(0)
    )

    this.startingPrice = await this._auction.startingPrice()
    this.startAt = ethers.BigNumber.from(await this._auction.startAt() * 1000)
    this.discountRate = await this._auction.discountRate()

    this.setState({
      selectedAccount: selectedAddress
    }, async () => {
      await this.updateBalance()
    })

    this.checkPriceInterval = setInterval(() => {
      const elapsed = ethers.BigNumber.from(
        Date.now()
        ).sub(this.startAt)
        const discount = this.discountRate.mul(elapsed)
        const newPrice = this.startingPrice.sub(discount)
      this.setState({
        currentPrice: ethers.utils.formatEther(newPrice)
      })
    }, 1000)
  }

  async updateBalance() {
    const newBalance = (await this._provider.getBalance(
      this.state.selectedAccount
    )).toString()

    this.setState({
      balance: newBalance
    })
  }

  _resetState() {
    this.setState(this.initialState)
  }

  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) { return true }

    this.setState({
      networkError: 'Please connect to localhost:8545'
    })

    return false
  }

  _dismissNetworkError = () => {
    this.setState({
      networkError: null
    })
  }
  
  render() {
    if(!this.state.selectedAccount) {
      return <ConnectWallet
      connectWallet={this._connectWallet}
      networkError={this.state.networkError}
      dismiss={this._dismissNetworkError}
      />
    }

    return(
      <>
        {this.state.balance &&
        <p>Your balance: {ethers.utils.formatEther(this.state.balance)} ETH</p>}

        {this.state.currentPrice &&
        <div>
          <p>Current item price: {this.state.currentPrice} ETH</p>
        </div>}
      </>
    )
  }
}

