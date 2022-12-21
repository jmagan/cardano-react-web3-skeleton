import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import useAuthAxios from './useAuthAxios';
import { useNavigate } from 'react-router-dom';

export default function useLogout() {
  const authAxios = useAuthAxios();

  const navigate = useNavigate();

  const { setWalletAddress, setAccessToken, setUserData } = useContext(AuthContext);

  const logout = async () => {
    await authAxios.get('/logout');

    setWalletAddress('');
    setAccessToken('');
    setUserData('');

    navigate('/login');
  };

  return logout;
}
