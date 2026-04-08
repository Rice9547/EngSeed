import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { login as apiLogin, fetchMe } from '../data/api';

interface AuthState {
  username: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  username: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then(user => setUsername(user.username))
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (user: string, password: string) => {
    const res = await apiLogin(user, password);
    localStorage.setItem('token', res.access_token);
    localStorage.setItem('username', res.username);
    setUsername(res.username);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ username, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
