import React, { useEffect, useState, useContext } from 'react';
import { WalletAPIContext } from '../context/WalletAPIContext';

import axios from 'axios';
import * as CSL from '@emurgo/cardano-serialization-lib-browser';

export default function RegisterPage() {

  const { walletAPI } = useContext(WalletAPIContext);

  const [stakeAddresses, setStakeAddresses] = useState([]);

  const [stakeAddress, setStakeAddress] = useState(undefined);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const userSignUp = async () => {
    try {
      const payload = {
        host: "HOST",
        action: "Sign up",
        name: userName,
        email: userEmail
      }
      const rewardAddress = CSL.Address.from_bech32(stakeAddress);

      const signature = await walletAPI.signData(rewardAddress.to_hex(), Buffer.from(JSON.stringify(payload)).toString('hex'));
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/register', {
        name: userName,
        email: userEmail,
        walletAddress: stakeAddress,
        key: signature.key,
        signature: signature.signature
      });

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }



  }

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

          console.log("Reward addresses: " + rewardAddresses);

          const rewardAddressesBech32 = rewardAddresses.map((addr) => {
            return CSL.Address.from_hex(addr).to_bech32();
          });

          console.log("Reward addresses bech32: " + rewardAddressesBech32);

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

                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                      <form className="mx-1 mx-md-4">

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-wallet fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
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
                            <label className="form-label" htmlFor="wallet">Wallet</label>
                          </div>
                        </div>


                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input type="text" id="form3Example1c" className="form-control"
                              onChange={(evt) => setUserName(evt.target.value)} />
                            <label className="form-label" htmlFor="form3Example1c">Your Name</label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input type="email" id="form3Example3c" className="form-control"
                              onChange={evt => setUserEmail(evt.target.value)} />
                            <label className="form-label" htmlFor="form3Example3c">Your Email</label>
                          </div>
                        </div>

                        <div className="form-check d-flex justify-content-center mb-5">
                          <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3c" />
                          <label className="form-check-label" htmlFor="form2Example3">
                            I agree all statements in <a href="#!">Terms of service</a>
                          </label>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button type="button" className="btn btn-primary btn-lg" onClick={() => userSignUp()} disabled={stakeAddress === undefined}>Register</button>
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
