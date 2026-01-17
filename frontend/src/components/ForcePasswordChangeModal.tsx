import { api } from "../api/api.js";
import React, { useState, useEffect } from 'react';
import AuthService from '../services/authService.js';
import { Shield, Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const ForcePasswordChangeModal = ({ onPasswordChanged }) => {
    const [formData, setFormData] = useState({
        passActual: '',
        passNueva: '',
        passConfirmar: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    
    const mismatch = formData.passConfirmar !== '' && formData.passNueva !== formData.passConfirmar;

    const handleSubmit = async () => {
        if (mismatch) return;
        setLoading(true);
        setError(null);

        try {
            // 1. Enviamos las credenciales al servicio de autenticación
            const response = await AuthService.cambiarContrasenia({
                contraseniaActual: formData.passActual,
                contraseniaNueva: formData.passNueva
            });
            
            // 2. Actualizamos el token de sesión para mantener la conexión activa
            if (response && response.token) {
                localStorage.setItem("token", response.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
            }

            // 3. Notificamos al contexto global para refrescar los datos del usuario
            await onPasswordChanged();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "La contraseña actual es incorrecta o la nueva no cumple los requisitos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[999] flex items-center justify-center p-4 overflow-hidden select-none">
            <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-300">
                
                
                <div className="text-center space-y-3">
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[30px] mx-auto flex items-center justify-center shadow-inner">
                        <Shield className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                        Seguridad <br/> Requerida
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed px-2">
                        Detectamos que es tu primer ingreso. Por tu seguridad, debes actualizar la clave provisoria para continuar.
                    </p>
                </div>

                
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Clave Actual</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input
                                type="password"
                                placeholder="Contraseña provisoria"
                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                value={formData.passActual}
                                onChange={(e) => setFormData({...formData, passActual: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nueva clave</label>
                        <input
                            type="password"
                            placeholder="Ingresa tu nueva clave"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                            value={formData.passNueva}
                            onChange={(e) => setFormData({...formData, passNueva: e.target.value})}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirmar nueva clave</label>
                        <input
                            type="password"
                            placeholder="Repite la clave"
                            className={`w-full px-6 py-4 bg-slate-50 border rounded-2xl font-bold text-sm outline-none transition-all ${mismatch ? 'border-rose-200 focus:ring-rose-500/10' : 'border-slate-100 focus:ring-indigo-500/10'}`}
                            value={formData.passConfirmar}
                            onChange={(e) => setFormData({...formData, passConfirmar: e.target.value})}
                        />
                    </div>

                   
                    {(error || mismatch) && (
                        <div className="flex items-center gap-2 text-rose-500 px-2 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="text-[10px] font-black uppercase tracking-wider">
                                {mismatch ? "Las contraseñas no coinciden" : error}
                            </span>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!formData.passActual || !formData.passNueva || !formData.passConfirmar || mismatch || loading}
                    className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 disabled:grayscale transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Actualizar y entrar
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ForcePasswordChangeModal;
