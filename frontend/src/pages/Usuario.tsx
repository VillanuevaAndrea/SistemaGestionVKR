
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { UserCircle, Key, LogOut, Mail, ChevronRight, Save, ShieldCheck, MessageCircle, Bell, Loader2, Edit3, CheckSquare, AlertCircle } from 'lucide-react';
import AuthService from '../services/authService.js';
import EmpleadoService from '../services/empleadoService.js';

const Usuario: React.FC = () => {
    const { user, recargarSesion, loading: authLoading, logout } = useAuth();

    // Manejo de modales unificado
    const [activeModal, setActiveModal] = useState<'EDIT_PROFILE' | 'CHANGE_PASSWORD' | 'NOTIFICATIONS' | null>(null);

    // ESTADOS PARA EL MODAL DE ÉXITO (Igual que en Configuración)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // ESTADO PARA ERRORES DE FORMULARIO (En rojo debajo del input)
    const [formError, setFormError] = useState<string | null>(null);

    // Estado único de formulario (estilo Productos)
    const [formData, setFormData] = useState({
        mail: '',
        telefono: '',
        passActual: '',
        passNueva: '',
        passConfirmar: '',
        notifEmail: true,
        notifWhatsApp: false
    });

    // Sincronizar formData cuando se abre un modal
    useEffect(() => {
        setFormError(null);
        if (activeModal === 'EDIT_PROFILE' && user) {
            setFormData(prev => ({
                ...prev,
                mail: user.empleadoMail || '',
                telefono: user.empleadoTelefono || ''
            }));
        }
        if (activeModal === 'CHANGE_PASSWORD') {
            setFormData(prev => ({ ...prev, passActual: '', passNueva: '', passConfirmar: '' }));
        }
    }, [activeModal, user]);

    // Validar coincidencia de contraseñas en tiempo real
    useEffect(() => {
        if (activeModal === 'CHANGE_PASSWORD' && formData.passConfirmar && formData.passNueva !== formData.passConfirmar) {
            setFormError("Las contraseñas no coinciden");
        } else {
            setFormError(null);
        }
    }, [formData.passNueva, formData.passConfirmar, activeModal]);

    const handleUpdateProfile = async () => {
        try {
            await EmpleadoService.actualizarEmpleado(user.empleadoId, { 
                mail: formData.mail, 
                telefono: formData.telefono 
            });

            await recargarSesion(); 
            
            setActiveModal(null);
            setSuccessMessage("Tus datos de contacto han sido actualizados correctamente.");
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error al actualizar");
        }
    };

    // ACCIÓN: CAMBIAR CONTRASEÑA (POST)
    const handleCambiarPassword = async () => {
        if (formData.passNueva !== formData.passConfirmar) {
            alert("Las contraseñas no coinciden");
            return;
        }
        try {
            await AuthService.cambiarContrasenia({
                contraseniaActual: formData.passActual,
                contraseniaNueva: formData.passNueva
            });
            setActiveModal(null);
            setSuccessMessage("Tu contraseña ha sido actualizada con éxito.");
            setShowSuccessModal(true);
            logout;
        } catch (error: any) {
            setFormError(error.response?.data?.message || "La contraseña actual es incorrecta");
        }
    };

    if (authLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando perfil...</p>
            </div>
        );
    }
    

    return (
        
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in"> 
            {/* TARJETA DE PERFIL */}
            <div className="bg-white p-12 rounded-[40px] border border-slate-200 shadow-sm text-center space-y-6">
                <div className="w-32 h-32 bg-indigo-600 text-white rounded-[40px] mx-auto flex items-center justify-center shadow-2xl shadow-indigo-200">
                    <span className="text-4xl font-black">{user?.nombreDeUsuario?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{user?.nombreDeUsuario}</h2>
                    <div className="flex justify-center gap-3 mt-2">
                        <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{user?.rol?.nombre}</span>
                    </div>
                    <div className="pt-4 space-y-2">
                        <p className="text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2 text-xs">
                            <Mail className="w-4 h-4 text-indigo-500" /> {user?.empleadoMail || 'Sin mail'}
                        </p>
                        <p className="text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2 text-xs">
                            <MessageCircle className="w-4 h-4 text-indigo-500" /> {user?.empleadoTelefono || 'Sin teléfono'}
                        </p>
                    </div>
                </div>
            </div>

            {/* MENÚ DE OPCIONES */}
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 bg-slate-50/50 border-b font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] px-8 text-center">Configuración de cuenta</div>
                <div className="divide-y divide-slate-100">
                    
                    <button onClick={() => setActiveModal('EDIT_PROFILE')} className="w-full p-8 flex items-center justify-between hover:bg-slate-50 transition-all group">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-white group-hover:text-indigo-600 shadow-sm transition-all"><Edit3 className="w-6 h-6" /></div>
                            <div className="text-left">
                                <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Editar Datos</p>
                                <p className="text-xs font-medium text-slate-400 mt-1">Modifica tu correo y teléfono de contacto</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-all" />
                    </button>

                    <button onClick={() => setActiveModal('CHANGE_PASSWORD')} className="w-full p-8 flex items-center justify-between hover:bg-slate-50 transition-all group">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-white group-hover:text-indigo-600 shadow-sm transition-all"><Key className="w-6 h-6" /></div>
                            <div className="text-left">
                                <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Cambiar contraseña</p>
                                <p className="text-xs font-medium text-slate-400 mt-1">Actualiza tu clave de acceso de forma segura</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-all" />
                    </button>

                    <button onClick={() => setActiveModal('NOTIFICATIONS')} className="w-full p-8 flex items-center justify-between hover:bg-slate-50 transition-all group">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-white group-hover:text-indigo-600 shadow-sm transition-all"><Bell className="w-6 h-6" /></div>
                            <div className="text-left">
                                <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Preferencias de aviso</p>
                                <p className="text-xs font-medium text-slate-400 mt-1">Recibir alertas de stock bajo</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-all" />
                    </button>
                    
                    <button onClick={logout} className="w-full p-10 flex items-center justify-center gap-3 text-rose-600 font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-50 transition-all">
                        <LogOut className="w-5 h-5" /> Cerrar sesión
                    </button>
                </div>
            </div>

            {/* MODAL: EDITAR CONTACTO */}
            {activeModal === 'EDIT_PROFILE' && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl p-12 space-y-10 animate-in zoom-in duration-300">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl mx-auto flex items-center justify-center mb-4">
                                <UserCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Editar contacto</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo electrónico</label>
                                <input 
                                    type="email" 
                                    value={formData.mail} 
                                    onChange={(e) => setFormData({...formData, mail: e.target.value})} 
                                    className="w-full bg-slate-50 border-none rounded-[24px] p-5 font-bold focus:ring-4 focus:ring-indigo-500/10" 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono</label>
                                <input 
                                    type="text" 
                                    value={formData.telefono} 
                                    onChange={(e) => setFormData({...formData, telefono: e.target.value})} 
                                    className="w-full bg-slate-50 border-none rounded-[24px] p-5 font-bold focus:ring-4 focus:ring-indigo-500/10" 
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setActiveModal(null)} className="flex-1 py-5 font-black text-[10px] uppercase text-slate-400 tracking-widest">Cancelar</button>
                            <button onClick={handleUpdateProfile} className="flex-[2] py-5 bg-indigo-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" /> Guardar cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: CAMBIAR CONTRASEÑA */}
            {activeModal === 'CHANGE_PASSWORD' && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl p-12 space-y-10 animate-in zoom-in duration-300">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl mx-auto flex items-center justify-center mb-4">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Actualizar clave</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asegúrate de usar una clave robusta</p>
                        </div>
                        <div className="space-y-6">
                            <input 
                                type="password" 
                                placeholder="Clave actual" 
                                value={formData.passActual}
                                onChange={e => setFormData({...formData, passActual: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-[24px] p-5 font-bold focus:ring-4 focus:ring-indigo-500/10" 
                            />
                            <input 
                                type="password" 
                                placeholder="Nueva clave" 
                                value={formData.passNueva}
                                onChange={e => setFormData({...formData, passNueva: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-[24px] p-5 font-bold focus:ring-4 focus:ring-indigo-500/10" 
                            />
                            <input 
                                type="password" 
                                placeholder="Confirmar nueva clave" 
                                value={formData.passConfirmar}
                                onChange={e => setFormData({...formData, passConfirmar: e.target.value})}
                                className="w-full bg-slate-50 border-none rounded-[24px] p-5 font-bold focus:ring-4 focus:ring-indigo-500/10" 
                            />
                            {/* MENSAJE DE ERROR EN ROJO */}
                            {formError && (
                                <div className="flex items-center gap-2 text-rose-500 px-4 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">{formError}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setActiveModal(null)} className="flex-1 py-5 font-black text-[10px] uppercase text-slate-400 tracking-widest">Cancelar</button>
                            <button 
                                onClick={handleCambiarPassword} 
                                disabled={!!formError || !formData.passActual || !formData.passNueva}
                                className="flex-[2] py-5 bg-indigo-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                            >
                                Confirmar cambio
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: NOTIFICACIONES */}
            {activeModal === 'NOTIFICATIONS' && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl p-12 space-y-10 animate-in zoom-in duration-300 relative">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl mx-auto flex items-center justify-center mb-4">
                                <Bell className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Notificaciones</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">¿Por dónde quieres recibir alertas de stock bajo?</p>
                        </div>

                        <div className="space-y-4">
                            <div 
                                onClick={() => setFormData({...formData, notifEmail: !formData.notifEmail})}
                                className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-transparent cursor-pointer hover:bg-white hover:border-indigo-100 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${formData.notifEmail ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-300'}`}>
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-black text-slate-700 uppercase tracking-widest">Mail</span>
                                </div>
                                <div className={`w-12 h-6 rounded-full relative transition-all ${formData.notifEmail ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.notifEmail ? 'left-7' : 'left-1'}`} />
                                </div>
                            </div>

                            <div 
                                onClick={() => setFormData({...formData, notifWhatsApp: !formData.notifWhatsApp})}
                                className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-transparent cursor-pointer hover:bg-white hover:border-indigo-100 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${formData.notifWhatsApp ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-300'}`}>
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-black text-slate-700 uppercase tracking-widest">WhatsApp</span>
                                </div>
                                <div className={`w-12 h-6 rounded-full relative transition-all ${formData.notifWhatsApp ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.notifWhatsApp ? 'left-7' : 'left-1'}`} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setActiveModal(null)} className="flex-1 py-5 font-black text-[10px] uppercase text-slate-400 tracking-widest">Cerrar</button>
                            <button onClick={() => setActiveModal(null)} className="flex-[2] py-5 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 hover:bg-black transition-all">
                                <Save className="w-4 h-4" /> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl p-10 space-y-6 animate-in zoom-in duration-300">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[30px] mx-auto flex items-center justify-center">
                                <CheckSquare className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-2xl font-bold text-slate-900 tracking-tight">¡Excelente!</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{successMessage}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-slate-900 text-white rounded-[20px] font-bold text-sm uppercase tracking-widest hover:bg-black active:scale-95 shadow-xl shadow-slate-200">
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Usuario;
