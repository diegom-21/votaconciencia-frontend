import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PartidosPage from './pages/PartidosPage';
import TemasPage from './pages/TemasPage';
import PropuestasPage from './pages/PropuestasPage';
import CronogramaPage from './pages/CronogramaPage';
import TriviasPage from './pages/TriviasPage';
import RecursosPage from './pages/RecursosPage';
import AdministradoresPage from './pages/AdministradoresPage';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública para login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Rutas protegidas del admin */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="partidos" element={<PartidosPage />} />
            <Route path="temas" element={<TemasPage />} />
            <Route path="propuestas" element={<PropuestasPage />} />
            <Route path="cronograma" element={<CronogramaPage />} />
            <Route path="trivias" element={<TriviasPage />} />
            <Route path="recursoseducativos" element={<RecursosPage />} />
            <Route path="administradores" element={<AdministradoresPage />} />
          </Route>

          {/* Redirección de la ruta raíz al dashboard si está autenticado */}
          <Route 
            path="/" 
            element={
              <Navigate to="/admin/dashboard" replace />
            } 
          />

          {/* Página 404 para rutas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
