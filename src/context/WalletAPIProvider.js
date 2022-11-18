import { useState, useEffect } from 'react'
import { Buffer } from 'buffer'

import { WalletAPIContext } from './WalletAPIContext.js'

const { Address } = await import('@emurgo/cardano-serialization-lib-browser')


export const WalletAPIProvider = ({
  children,
}) => {
  const { cardano } = window

  const [selectedWallet, setSelectedWallet] = useState()
  const [walletAPI, setWalletAPI] = useState()
  const [address, setAddress] = useState(localStorage.getItem('address'))
  const [networkId, setNetworkId] = useState(localStorage.getItem('networkId'))

  const [walletAPIError, setWalletAPIError] = useState()
  const [isMainnet, setIsMainnet] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('selectedWallet')) {
      selectWallet(localStorage.getItem('selectedWallet'))
    }
  }, [])

  useEffect(() => {
    if (selectedWallet) {
      connectWallet()
    }
  }, [selectedWallet])

  useEffect(() => {
    if (networkId === 0) {
      getAddress()
      setIsMainnet(false)
    } else if (networkId === 1) {
      getAddress()
      setIsMainnet(true)
    }
  }, [networkId])

  const selectWallet = (wallet) => {
    setSelectedWallet(wallet)
    localStorage.setItem('selectedWallet', wallet)
  }

  const connectWallet = async () => {
    if (selectedWallet === undefined) return

    let walletAPIResponse
    try {
      if (selectedWallet === 'Nami') {
        walletAPIResponse = await cardano?.nami?.enable()
      } else if (selectedWallet === 'Flint') {
        walletAPIResponse = await cardano?.flint?.enable()
      } else if (selectedWallet === 'Eternl') {
        walletAPIResponse = await cardano?.eternl?.enable()
      }

      if (walletAPIResponse === undefined) return

      if (walletAPIResponse.hasOwnProperty('getNetworkId')) {
        // WalletAPI fetched successfully
        const _walletAPI = walletAPIResponse
        const _networkId = await _walletAPI.getNetworkId()

        setWalletAPI(_walletAPI)
        localStorage.setItem('networkId', _networkId)
        setNetworkId(_networkId)
      } else {
        // There was an APIError
        const _APIError = walletAPIResponse

        setWalletAPIError(_APIError)
      }
    } catch (err) {
      setNetworkId(null)
      setAddress(null)
      setSelectedWallet(null)
      console.log(err)
    }
  }

  const getAddress = async () => {
    const raw = await walletAPI?.getChangeAddress()
    const addr = Address.from_bytes(Buffer.from(raw ?? '', 'hex')).to_bech32()
    localStorage.setItem('address', addr)
    setAddress(addr)
  }

  return (
    <WalletAPIContext.Provider
      value={{
        address,
        networkId,
        selectedWallet,
        walletAPI,
        walletAPIError,
        selectWallet,
        connectWallet,
        isMainnet
      }}
    >
      {children}
    </WalletAPIContext.Provider>
  )
}
