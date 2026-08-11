import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { Login } from './pages/Login';
import { Home } from './pages/home/index';
import { NotFound } from './pages/404';
import { MainLayout } from './components/layout/main';
// import { ProtectedRoute } from './components/layout/protected';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ochiq yo'nalishlar */}
        {/* <Route path="/login" element={<Login />} /> */}

        {/* Himoyalangan (Auth) yo'nalishlar */}
        {/* <Route element={<ProtectedRoute />}> */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        {/* </Route> */}

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;