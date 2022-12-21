import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div className="container">
      <section className="vh-100">
        <div className="container h-100">
          <div className="row h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card mt-5">
                <div className="card-header text-center">
                  <h1>Unauthorized</h1>
                </div>
                <div className="card-body">
                  <p>You do not have access to the requested page.</p>
                  <div className="flexGrow">
                    <button className="btn btn-danger" onClick={goBack}>
                      Go Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
