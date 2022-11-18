import { createContext } from 'react'


export const WalletAPIContext = createContext(
  {
    address: null,
    networkId: null,
    selectedWallet: null,
    walletAPI: null,
    walletAPIError: null,
    selectWallet: (wallet) => {},
    connectWallet: () => {},
    isMainnet: null,
    contextLoaded: true
  }
)
