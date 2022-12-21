import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="container">
      <section className="vh-100">
        <div className="container h-100">
          <div className="row h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card mt-5">
                <div className="card-header text-center">
                  <h1>Main menu</h1>
                </div>
                <div className="card-body">
                  <h1>Links</h1>
                  <h2>Public pages</h2>
                  <ul>
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
                  </ul>
                  <h2>Private pages</h2>
                  <ul>
                    <li className="nav-item">
                      <Link className="nav-link" to="/profile">
                        Profile (User)
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/user">
                        Users (Administrator)
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/city">
                        Cities (Administrator)
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
