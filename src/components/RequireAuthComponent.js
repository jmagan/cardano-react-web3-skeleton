import React, { useContext } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

export default function RequireAuthComponent() {
  const { walletAddress } = useContext(AuthContext)
  const location = useLocation()

  return (
    walletAddress ? <Outlet /> :
      <Navigate to='/login' state={{ from: location }} />
  )
}
