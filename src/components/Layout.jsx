import { Outlet } from 'react-router-dom';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import Carrito from './Carrito.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
      {!isAdmin && <Carrito />}
    </div>
  );
}