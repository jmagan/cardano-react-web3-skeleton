import { createContext, useState } from "react";

const AuthContext = createContext({ 
  walletAddress: null,
  setWalletAddress: () => {},
  accessToken: null,
  setAccessToken: () => {},
  userData: null,
  setUserData: () => {}
});

export function AuthProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [userData, setUserData] = useState(null)

  return (
    <AuthContext.Provider value={{ 
      walletAddress, 
      setWalletAddress,
      accessToken,
      setAccessToken,
      userData,
      setUserData
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext