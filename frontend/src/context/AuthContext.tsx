import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/authService.js';

interface AuthContextType {
  user: any;
  permisos: string[];
  loading: boolean;
  tienePermiso: (codigo: string) => boolean;
  recargarSesion: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [permisos, setPermisos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));

      if (payload.primerLogin === true) {
        setUser({ ...payload, primerLogin: true });
        setLoading(false);
        return;
      }

      const userData = await AuthService.getMe();
      setUser(userData);

      if (userData?.rol?.permisos) {
        const codigos = userData.rol.permisos.map((p: any) => p.codigo);
        setPermisos(codigos);
      }
    } catch (error) {
      console.error("Error al sincronizar sesión:", error);
      AuthService.logout(); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const tienePermiso = (codigo: string) => {
    return permisos.includes(codigo);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPermisos([]);
    setLoading(false);
    window.location.href = "/#/login";
    };

  return (
    <AuthContext.Provider value={{ user, permisos, loading, tienePermiso, recargarSesion: cargarDatos, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
