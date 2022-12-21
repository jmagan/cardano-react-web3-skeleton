import React, { useContext } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
export default function RequireAuthComponent({ allowedRoles }) {
  const { walletAddress } = useContext(AuthContext);
  const location = useLocation();
  const { userData } = useContext(AuthContext);

  return (
    <>
      {allowedRoles.includes(userData?.role) ? (
        <Outlet />
      ) : walletAddress ? (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
      ) : (
        <Navigate to="/login" state={{ from: location }} />
      )}
    </>
  );
}
