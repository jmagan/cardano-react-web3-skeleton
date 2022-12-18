import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from '../util/axios';

export default function useRefreshToken() {
  const { setAccessToken, setUserData, setWalletAddress } = useContext(AuthContext);

  async function refresh() {
    const response = await axios.get('/token');

    setAccessToken(response.data.accessToken);
    setUserData(response.data.user);
    setWalletAddress(response.data.user.walletAddress);

    return response.data;
  }

  return refresh;
}
