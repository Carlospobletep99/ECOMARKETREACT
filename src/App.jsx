import { Container } from 'react-bootstrap';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import IndexPage from './pages/IndexPage.jsx';
import CatalogoPage from './pages/CatalogoPage.jsx';
import PedidoPage from './pages/PedidoPage.jsx';
import NosotrosPage from './pages/NosotrosPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegistroPage from './pages/RegistroPage.jsx';
import PerfilPage from './pages/PerfilPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

function AppRoutes() {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={isAdmin ? <Navigate to="/perfil" replace /> : <IndexPage />} />
        <Route path="catalogo" element={isAdmin ? <Navigate to="/perfil" replace /> : <CatalogoPage />} />
        <Route path="pedido" element={isAdmin ? <Navigate to="/perfil" replace /> : <PedidoPage />} />
        <Route path="nosotros" element={<NosotrosPage />} />
        <Route path="login" element={user ? <Navigate to="/perfil" replace /> : <LoginPage />} />
        <Route path="registro" element={user ? <Navigate to="/perfil" replace /> : <RegistroPage />} />
        <Route path="perfil" element={user ? <PerfilPage /> : <Navigate to="/login" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Container fluid className="p-0">
      <AppRoutes />
    </Container>
  );
}