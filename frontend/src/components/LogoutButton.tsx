import { useNavigate } from 'react-router-dom';
import { clearAuthUser } from '../utils/authSession';
import './LogoutButton.css';

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthUser();
    navigate('/', { replace: true });
  };

  return (
    <button type="button" className="cc-logout-button" onClick={handleLogout} aria-label="Logout" title="Logout">
      Logout
    </button>
  );
}
