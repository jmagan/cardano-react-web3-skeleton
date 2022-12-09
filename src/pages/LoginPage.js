import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { WalletAPIContext } from '../context/WalletAPIContext';

import axios from 'axios';
import * as CSL from '@emurgo/cardano-serialization-lib-browser';
import AuthContext from '../context/AuthContext';


export default function LoginPage() {
  const { walletAPI } = useContext(WalletAPIContext);
  const { setWalletAddress, setAccessToken, setUserData } = useContext(AuthContext)

  const [errorMessage, setErrorMessage] = useState([])
  const [stakeAddresses, setStakeAddresses] = useState([]);
  const [stakeAddress, setStakeAddress] = useState(undefined);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userLogin = async () => {
    try {
      const payload = {
        host: "HOST",
        action: "Login"
      }
      const rewardAddress = CSL.Address.from_bech32(stakeAddress);

      const signature = await walletAPI.signData(rewardAddress.to_hex(), Buffer.from(JSON.stringify(payload)).toString('hex'));
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/login', {
        walletAddress: stakeAddress,
        key: signature.key,
        signature: signature.signature
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      setWalletAddress(stakeAddress);
      setAccessToken(response.data.accessToken)
      setUserData(response.data.user)
      navigate(from);
    } catch (error) {
      if (!error?.response) {
        setErrorMessage('No Server Response');
      } else if (Array.isArray(error.response.data.errors.msg)) {
        setErrorMessage(error.response.data.errors.msg.map(val => val.param + ': ' + val.msg))
      } else {
        setErrorMessage([error.response.data.errors.msg])
      }
    }
  }

  useEffect(() => {
    setErrorMessage('');
  }, [stakeAddress])

  useEffect(() => {
    if (stakeAddress === undefined && stakeAddresses?.length === 1) {
      setStakeAddress(stakeAddresses[0]);
    }
  }, [stakeAddress, stakeAddresses]);

  useEffect(() => {
    (
      async () => {
        if (walletAPI !== undefined) {
          const rewardAddresses = await walletAPI.getRewardAddresses();
          const rewardAddressesBech32 = rewardAddresses.map((addr) => {
            return CSL.Address.from_hex(addr).to_bech32();
          });
          setStakeAddresses(rewardAddressesBech32);
        }
      }
    )();
  }, [walletAPI]);

  return (
    <div className='container'>
      <section className="vh-100"  >
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: '25px' }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      {
                        errorMessage.length > 0 &&
                        <div className="alert alert-primary" role="alert">
                          {
                            errorMessage.map(error => { return <>{error} <br /></> })
                          }
                        </div>
                      }

                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Login</p>

                      <form className="mx-1 mx-md-4">

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-wallet fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <label className="form-label" htmlFor="wallet">Wallet</label>
                            <select className="form-select" id="wallet" aria-label="Default select example"
                              value={stakeAddress}
                              disabled={stakeAddresses.length === 0}
                              onChange={event => setStakeAddress(event.target.value)}>
                              {
                                stakeAddresses.map((option) => {
                                  return <option key={option} value={option}>{option}</option>
                                })
                              }
                            </select>
                          </div>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button type="button" className="btn btn-primary btn-lg" onClick={() => userLogin()} disabled={stakeAddress === undefined}>Login</button>
                        </div>

                      </form>

                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

                      <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                        className="img-fluid" alt="Sample" />

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


