import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

import { WalletAPIContext } from '../context/WalletAPIContext';

import WalletIcon from './WalletIconComponent';
import useLogout from '../hooks/useLogout';

import '@popperjs/core';
import 'bootstrap/dist/js/bootstrap';

export default function NavigationBarComponent() {
  const { cardano } = window;

  const { address, networkId, selectWallet, selectedWallet } = useContext(WalletAPIContext);

  const { userData, walletAddress } = useContext(AuthContext);

  const logout = useLogout();

  useEffect(() => {
    console.log('Address changed', address);
  }, [address]);

  useEffect(() => {
    console.log('NetworkId changed', networkId);
  }, [networkId]);

  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand mb-0 h1" to="/">
            <img src="/logo192.png" alt="Cardania NFT Marketplace" style={{ height: '35px' }} />
          </Link>
          <button
            className="navbar-toggler mb-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <ul className="navbar-nav">
              {!walletAddress ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/" onClick={() => logout()}>
                      Logout
                    </Link>
                  </li>
                </>
              )}
              <li className="nav-item navbar-text">
                {userData?.name ? (
                  <span className="p-2 text-white bg-success border border-success rounded-pill">{userData?.name}</span>
                ) : (
                  ''
                )}
              </li>
              <li className="nav-item mt-2 mt-sm-0">
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle ms-2 me-1"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {selectedWallet !== null && <WalletIcon></WalletIcon>} {selectedWallet == null && 'Not Connected'}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
                    {window.cardano?.nami && selectedWallet !== 'Nami' && (
                      <li>
                        <button className="dropdown-item align-middle" onClick={() => selectWallet('Nami')}>
                          <img src={cardano.nami.icon} alt="" height="18px" style={{ marginRight: '10px' }} /> Nami
                        </button>
                      </li>
                    )}
                    {window.cardano?.eternl && selectedWallet !== 'Eternl' && (
                      <li>
                        <button className="dropdown-item align-bottom" onClick={() => selectWallet('Eternl')}>
                          <img src={cardano.eternl.icon} alt="" height="18px" style={{ marginRight: '10px' }} /> Eternl
                        </button>
                      </li>
                    )}
                    {window.cardano?.flint && selectedWallet !== 'Flint' && (
                      <li>
                        <button className="dropdown-item align-bottom" onClick={() => selectWallet('Flint')}>
                          <img src={cardano.flint.icon} alt="" height="18px" style={{ marginRight: '10px' }} /> Flint
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
