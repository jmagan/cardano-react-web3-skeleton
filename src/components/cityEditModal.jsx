import React, { useEffect, useState } from 'react';
import * as bootstrap from 'bootstrap';
import useAuthAxios from '../hooks/useAuthAxios';

export default function CityEditModal({ open, cityId, closeCB }) {
  const authAxios = useAuthAxios();

  const [modal, setModal] = useState();

  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const getCity = async () => {
      if (cityId) {
        const response = await authAxios.get(`/cities/${cityId}`);

        console.log(response.data);

        setCreatedAt(response.data.createdAt);
        setUpdatedAt(response.data.updatedAt);
        setName(response.data.name);
      } else {
        setCreatedAt('');
        setUpdatedAt('');
        setName('');
      }
    };

    getCity();
  }, [cityId, authAxios]);

  const submitFormHandle = async (evt) => {
    evt.preventDefault();

    const payload = {
      createdAt,
      updatedAt,
      name,
    };

    let response;
    if (cityId) {
      response = await authAxios.patch(`/cities/${cityId}`, payload);
    } else {
      response = await authAxios.post(`/cities`, payload);
    }

    if (response.status === 200 || response.status === 201) {
      modal.hide();
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById('city-edit-modal');
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
    <div id="city-edit-modal" className="modal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit city</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form id="edit-city-form" className="row g-3" onSubmit={submitFormHandle}>
              <div className="col-md-6">
                <label htmlFor="createdAt" className="form-label">
                  Created at
                </label>
                <input type="text" className="form-control" id="createdAt" value={updatedAt} readOnly />
              </div>
              <div className="col-md-6">
                <label htmlFor="updatedAt" className="form-label">
                  Updated at
                </label>
                <input type="text" className="form-control" id="updatedAt" value={createdAt} readOnly />
              </div>
              <div className="col-12">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(evt) => setName(evt.target.value)}
                  required
                />
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
