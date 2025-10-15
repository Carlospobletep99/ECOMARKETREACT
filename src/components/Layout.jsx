import { Outlet } from 'react-router-dom';
import NavigationBar from './NavigationBar.jsx';
import SiteFooter from './SiteFooter.jsx';

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavigationBar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}