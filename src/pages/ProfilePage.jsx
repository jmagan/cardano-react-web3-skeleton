import { CanceledError } from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import useAuthAxios from '../hooks/useAuthAxios';

export default function ProfilePage() {
  const controller = new AbortController();

  const authAxios = useAuthAxios();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [urlGithub, setUrlGithub] = useState('');
  const [urlTwitter, setUrlTwitter] = useState('');

  const [cities, setCities] = useState([]);

  const [errorMessage, setErrorMessage] = useState([]);
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    setErrorMessage([]);
    setInfoMessage('');

    const getProfile = async () => {
      try {
        const response = await authAxios.get('/profile', { signal: controller.signal });

        const profile = response.data;

        if (isMounted) {
          setEmail(profile.email);
          setName(profile.name);
          setPhone(profile.phone ?? '');
          setCity(profile.city ?? '');
          setCountry(profile.country ?? '');
          setWalletAddress(profile.walletAddress ?? '');
          setUrlTwitter(profile.urlTwitter ?? '');
          setUrlGithub(profile.urlGithub ?? '');
        }

        console.log(response.data);
      } catch (error) {
        if (!(error instanceof CanceledError) && !error?.response) {
          setErrorMessage(['No Server Response']);
        } else if (error?.response?.data?.errors && Array.isArray(error.response.data.errors.msg)) {
          setErrorMessage(error.response.data.errors.msg.map((val) => val.param + ': ' + val.msg));
        } else if (error.response?.data?.errors) {
          setErrorMessage([error.response.data.errors.msg]);
        }
      }
    };

    const getAllCities = async () => {
      try {
        const response = await authAxios.get('/cities/all', { signal: controller.signal });
        isMounted && setCities(response.data);
        console.log(response.data);
      } catch (error) {
        if (!(error instanceof CanceledError) && !error?.response) {
          setErrorMessage(['No Server Response']);
        } else if (error?.response?.data?.errors && Array.isArray(error.response.data.errors.msg)) {
          setErrorMessage(error.response.data.errors.msg.map((val) => val.param + ': ' + val.msg));
        } else if (error.response?.data?.errors) {
          setErrorMessage([error.response.data.errors.msg]);
        }
      }
    };

    getProfile();
    getAllCities();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const saveProfile = async (evt) => {
    evt.preventDefault();
    setInfoMessage('');

    const payload = {
      name,
      phone,
      city,
      country,
      urlGithub,
      urlTwitter,
    };

    try {
      await authAxios.patch('/profile', payload);
      setErrorMessage([]);
      setInfoMessage('Profile saved');
    } catch (error) {
      if (!(error instanceof CanceledError) && !error?.response) {
        setErrorMessage(['No Server Response']);
      } else if (error?.response?.data?.errors && Array.isArray(error.response.data.errors.msg)) {
        setErrorMessage(error.response.data.errors.msg.map((val) => val.param + ': ' + val.msg));
      } else if (error.response?.data?.errors) {
        setErrorMessage([error.response.data.errors.msg]);
      }
    }
  };

  return (
    <div className="container">
      <section className="vh-100">
        <div className="container h-100">
          <div className="row h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card mt-5">
                <div className="card-header text-center">
                  <h1>Profile</h1>
                </div>
                <div className="card-body">
                  {errorMessage.length > 0 && (
                    <div className="alert alert-danger" role="alert">
                      {errorMessage.map((error) => {
                        return (
                          <span key={error}>
                            {error} <br />
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {infoMessage && (
                    <div className="alert alert-primary" role="alert">
                      {infoMessage}
                    </div>
                  )}

                  <form onSubmit={saveProfile}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" id="email" name="email" value={email} disabled />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={name}
                          required
                          onChange={(evt) => setName(evt.target.value)}
                        />
                      </div>

                      <div className="col-md-4">
                        <label htmlFor="phone">Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          id="phone"
                          name="phone"
                          value={phone}
                          required
                          onChange={(evt) => setPhone(evt.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="city">City</label>
                        <select
                          name="city"
                          id="city"
                          className="form-select"
                          value={city}
                          required
                          onChange={(evt) => setCity(evt.target.value)}
                        >
                          <option value="">None</option>
                          {cities.map((city) => (
                            <option key={city._id} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="country">Country</label>
                        <input
                          type="text"
                          className="form-control"
                          id="country"
                          name="country"
                          value={country}
                          required
                          onChange={(evt) => setCountry(evt.target.value)}
                        />
                      </div>

                      <div className="col-12">
                        <label htmlFor="walletAddress">Wallet Address</label>
                        <select
                          name="walletAddress"
                          id="walletAddress"
                          className="form-select"
                          disabled
                          value={walletAddress}
                        >
                          <option value={walletAddress}>{walletAddress}</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="urlTwitter">Twitter</label>
                        <input
                          type="text"
                          className="form-control"
                          id="urlTwitter"
                          name="urlTwitter"
                          value={urlTwitter}
                          onChange={(evt) => setUrlTwitter(evt.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="urlGithub">GitHub</label>
                        <input
                          type="text"
                          className="form-control"
                          id="urlGithub"
                          name="urlGithub"
                          value={urlGithub}
                          onChange={(evt) => setUrlGithub(evt.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <button className="btn btn-primary">Save</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
