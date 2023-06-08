import './App.scss';

import NavigationBarComponent from './components/NavigationBarComponent';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import RequireAuthComponent from './components/RequireAuthComponent';
import { WalletAPIProvider } from './context/WalletAPIContext';
import { AuthProvider } from './context/AuthContext';
import ProfilePage from './pages/ProfilePage';
import CityPage from './pages/CityPage';
import PersistLoginComponent from './components/PersistLoginComponent';
import UserPage from './pages/UserPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

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
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Public private */}
                <Route element={<PersistLoginComponent />}>
                  {/* User and administrator role pages*/}
                  <Route element={<RequireAuthComponent allowedRoles={['user', 'admin']} />}>
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>

                  {/* Administrator role pages*/}
                  <Route element={<RequireAuthComponent allowedRoles={['admin']} />}>
                    <Route path="/city" element={<CityPage />} />
                    <Route path="/user" element={<UserPage />} />
                  </Route>
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
