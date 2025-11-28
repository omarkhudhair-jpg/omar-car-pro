import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Fuel from './pages/Fuel';
import Maintenance from './pages/Maintenance';
import Expenses from './pages/Expenses';
import Vehicles from './pages/Vehicles';
import Settings from './pages/Settings';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="fuel" element={<Fuel />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
