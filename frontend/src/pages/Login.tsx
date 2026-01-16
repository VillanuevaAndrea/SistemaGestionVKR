
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, User } from 'lucide-react';
import AuthService from '../services/authService.js';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { recargarSesion } = useAuth();
  const [loading, setLoading] = useState(false);

  const [nombreDeUsuario, setNombreDeUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthService.login({
        nombreDeUsuario: nombreDeUsuario,
        contrasenia: contrasenia
      });
      await recargarSesion();
      navigate('/dashboard');
    } catch (error) {
      console.error("Error en el componente login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8 pb-0 text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center font-black text-3xl text-white shadow-lg mb-6">
              V
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bienvenido a VKR</h1>
            <p className="text-slate-500 text-sm mt-2">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Nombre de usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input 
                    type="text"
                    required
                    value={nombreDeUsuario}
                    onChange={(e) => setNombreDeUsuario(e.target.value)}
                    placeholder="Tu nombre de usuario"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input 
                    type="password" 
                    required
                    value={contrasenia}
                    onChange={(e) => setContrasenia(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center">
              <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">¿Olvidaste tu contraseña?</a>
            </div>
          </form>
        </div>
        
        <p className="text-center text-slate-500 text-[10px] uppercase tracking-widest mt-8">
          © 2024 VIKIARA INDUMENTARIA • GESTIÓN INTERNA
        </p>
      </div>
    </div>
  );
};

export default Login;
