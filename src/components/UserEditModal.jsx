import React, { useEffect, useState } from 'react';
import * as bootstrap from 'bootstrap';
import useAuthAxios from '../hooks/useAuthAxios';

export default function UserEditModal({ open, userId, closeCB }) {
  const authAxios = useAuthAxios();

  const [modal, setModal] = useState();

  const [cities, setCities] = useState([]);

  const [errorMessage, setErrorMessage] = useState([]);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [role, setRole] = useState('');
  const [urlGitHub, setUrlGitHub] = useState('');
  const [urlTwitter, setUrlTwitter] = useState('');

  useEffect(() => {
    const getCity = async () => {
      if (userId) {
        const response = await authAxios.get(`/users/${userId}`);

        console.log(response.data);

        setEmail(response.data.email);
        setName(response.data.name);
        setWalletAddress(response.data.walletAddress);
        setPhone(response.data.phone ?? '');
        setCity(response.data.city ?? '');
        setCountry(response.data.country ?? '');
        setRole(response.data.role ?? '');
        setUrlTwitter(response.data.urlTwitter ?? '');
        setUrlGitHub(response.data.urlGitHub ?? '');
      } else {
        setEmail('');
        setName('');
        setWalletAddress('');
        setPhone('');
        setCity('');
        setCountry('');
        setRole('');
        setUrlTwitter('');
        setUrlGitHub('');
      }
    };

    const getAllCities = async () => {
      try {
        const response = await authAxios.get('/cities/all');
        setCities(response.data);
        console.log(response.data);
      } catch (error) {
        if (!error?.response) {
          setErrorMessage(['No Server Response']);
        } else if (error?.response?.data?.errors && Array.isArray(error.response.data.errors.msg)) {
          setErrorMessage(error.response.data.errors.msg.map((val) => val.param + ': ' + val.msg));
        } else if (error.response?.data?.errors) {
          setErrorMessage([error.response.data.errors.msg]);
        }
      }
    };

    getCity();
    getAllCities();
  }, [userId, authAxios]);

  const submitFormHandle = async (evt) => {
    evt.preventDefault();

    const payload = {
      name,
      email,
      walletAddress,
      phone,
      city,
      country,
      role,
      urlTwitter,
      urlGitHub,
    };

    let response;
    if (userId) {
      response = await authAxios.patch(`/users/${userId}`, payload);
    } else {
      response = await authAxios.post(`/users`, payload);
    }

    if (response.status === 200 || response.status === 201) {
      modal.hide();
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById('user-edit-modal');
    if (closeCB !== undefined) {
      modalElement.addEventListener('hide.bs.modal', () => closeCB());
    }
    setModal(new bootstrap.Modal(modalElement));
  }, [closeCB]);

  useEffect(() => {
    if (modal !== undefined) {
      open ? modal.show() : modal.hide();
    }
  }, [open, modal]);

  return (
    <div id="user-edit-modal" className="modal" tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit user</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
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
            <form id="edit-city-form" onSubmit={submitFormHandle}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    required
                    onChange={(evt) => setEmail(evt.target.value)}
                  />
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
                  <input
                    type="text"
                    className="form-control"
                    id="walletAddress"
                    name="walletAddress"
                    value={walletAddress}
                    readOnly={userId}
                    required
                    onChange={(evt) => setWalletAddress(evt.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="role">Role</label>
                  <select
                    name="role"
                    id="role"
                    className="form-select"
                    value={role}
                    onChange={(evt) => setRole(evt.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
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
                  <label htmlFor="urlGitHub">GitHub</label>
                  <input
                    type="text"
                    className="form-control"
                    id="urlGitHub"
                    name="urlGitHub"
                    value={urlGitHub}
                    onChange={(evt) => setUrlGitHub(evt.target.value)}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="submit" form="edit-city-form" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
