import './App.scss';
import '@popperjs/core';
import 'bootstrap/dist/js/bootstrap';

import NavigationBarComponent from './components/NavigationBarComponent';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import { WalletAPIProvider } from './context/WalletAPIProvider';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <WalletAPIProvider>
      <BrowserRouter>
        <div className="App">
          <header>
            <NavigationBarComponent />
          </header>
          <main style={{ backgroundColor: '#eee' }}>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/login' element={<LoginPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </WalletAPIProvider>
  );
}

export default App;
