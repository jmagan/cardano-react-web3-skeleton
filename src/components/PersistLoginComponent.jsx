import { Outlet } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import AuthContext from '../context/AuthContext';

export default function PersistLoginComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { accessToken } = useContext(AuthContext);
  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, [accessToken, refresh]);

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
}
