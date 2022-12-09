import './App.scss';
import '@popperjs/core';
import 'bootstrap/dist/js/bootstrap';

import NavigationBarComponent from './components/NavigationBarComponent';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import RequireAuthComponent from './components/RequireAuthComponent';
import PrivatePage from './pages/PrivatePage';
import { WalletAPIProvider } from './context/WalletAPIContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <WalletAPIProvider>
        <AuthProvider>
          <div className="App">
            <header>
              <NavigationBarComponent />
            </header>
            <main style={{ backgroundColor: '#eee' }}>
              <Routes>
                {/* Public pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Public private */}
                <Route element={<RequireAuthComponent />}>
                  <Route path="/private" element={<PrivatePage />} />
                </Route>
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </WalletAPIProvider>
    </BrowserRouter>
  );
}

export default App;
