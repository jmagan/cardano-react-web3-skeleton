import { createContext, useState } from "react";

const AuthContext = createContext({ 
  walletAddress: null,
  accessToken: null 
});

export function AuthProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  return (
    <AuthContext.Provider value={{ 
      walletAddress, 
      setWalletAddress,
      accessToken,
      setAccessToken
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext