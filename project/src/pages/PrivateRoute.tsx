// PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import dayjs from 'dayjs';
import axios from 'axios';

interface PrivateRouteProps {
  children: React.ReactNode;
}

interface DecodedToken {
  exp: number; // expiry time in seconds
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  let accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Check expiry
  const decoded: DecodedToken = jwtDecode(accessToken);
  const isExpired = dayjs.unix(decoded.exp).isBefore(dayjs());

  if (isExpired) {
    if (!refreshToken) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return <Navigate to="/login" replace />;
    }

    // ✅ Try refreshing
    return (
      <TokenRefresher>
        {children}
      </TokenRefresher>
    );
  }

  return <>{children}</>;
};

// Component to refresh token before showing the page
const TokenRefresher: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    const refresh = async () => {
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
          refresh: localStorage.getItem('refresh_token'),
        });
        localStorage.setItem('access_token', res.data.access);
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    };
    refresh();
  }, []);

  return <>{children}</>;
};

export default PrivateRoute;
