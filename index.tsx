import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Labs } from './pages/Labs';
import { LabDetails } from './pages/LabDetails';
import { ExperimentDetails } from './pages/ExperimentDetails';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/labs" replace />} />
            <Route path="labs" element={<Labs />} />
            <Route path="labs/:labId" element={<LabDetails />} />
            <Route path="labs/:labId/experiments/:experimentId" element={<ExperimentDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);