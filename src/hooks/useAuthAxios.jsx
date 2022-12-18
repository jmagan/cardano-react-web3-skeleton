import { axiosPrivate } from '../util/axios';
import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import useRefreshToken from './useRefreshToken';

export default function useAuthAxios() {
  const { accessToken, setAccessToken, setUserData, setWalletAddress } = useContext(AuthContext);
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          try {
            const refreshData = await refresh();
            setAccessToken(refreshData.accessToken);
            prevRequest.headers = { ...prevRequest.headers };
            prevRequest.headers['Authorization'] = `Bearer ${refreshData.accessToken}`;

            return axiosPrivate(prevRequest);
          } catch (err) {
            setAccessToken(null);
            setUserData(null);
            setWalletAddress(null);
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, setAccessToken, setUserData, setWalletAddress, refresh]);

  return axiosPrivate;
}
