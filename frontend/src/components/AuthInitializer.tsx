import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';

const AuthInitializer: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        dispatch(loginSuccess({ user, token: storedToken }));
        return;
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    const sessionUser = sessionStorage.getItem('user');
    const sessionToken = sessionStorage.getItem('token');
    
    if (sessionUser && sessionToken) {
      try {
        const user = JSON.parse(sessionUser);
        dispatch(loginSuccess({ user, token: sessionToken }));
      } catch (error) {
        console.error('Failed to parse session user:', error);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
      }
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default AuthInitializer;
