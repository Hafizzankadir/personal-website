import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SiteNav from './components/SiteNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import FinancialMarketJournal from './pages/FinancialMarketJournal';
import Ideas from './pages/Ideas';
import Projects from './pages/Projects';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import RequireAuth from './pages/admin/RequireAuth';

function PublicLayout({ children }) {
  return (
    <>
      <SiteNav />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/journal" element={<PublicLayout><FinancialMarketJournal /></PublicLayout>} />
          <Route path="/ideas" element={<PublicLayout><Ideas /></PublicLayout>} />
          <Route path="/philosophy" element={<Navigate to="/ideas?tab=philosophy" replace />} />
          <Route path="/knowledge" element={<Navigate to="/ideas?tab=knowledge" replace />} />
          <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard/*"
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
