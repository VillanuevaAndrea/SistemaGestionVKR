import React, { useEffect, useState, useCallback } from 'react';
import { Empleado } from '../types.ts';
import {
  Mail,
  Trash2,
  Save,
  Search,
  MapPin,
  Phone,
  Edit,
  UserPlus,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react';

import EmpleadoService from '../services/empleadoService.js';
import RolService from '../services/rolService.js';
import UsuarioService from '../services/usuarioService.js';

const Empleados: React.FC = () => {
  // Estados de Datos
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de Filtros y Paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Modales
  const [activeModal, setActiveModal] = useState<'ADD' | 'EDIT' | 'DELETE' | null>(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<any | null>(null);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [direccion, setDireccion] = useState('');
  const [mail, setMail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rolId, setRolId] = useState<number | ''>('');

  // =========================
  // CARGAR DATOS (Lógica Unificada)
  // =========================
  
  const fetchEmpleados = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        nombre: searchTerm,
        pagina: paginaActual
      };
      
      const data = await EmpleadoService.getEmpleados(filters);
      
      setEmpleados(data.content || []);
      setTotalPaginas(data.totalPages || 1);
    } catch (error) {
      console.error("Error cargando empleados:", error);
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, paginaActual]);

  // Debounce para la búsqueda 
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchEmpleados();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchEmpleados]);

  // Resetear página al buscar
  useEffect(() => {
    setPaginaActual(0);
  }, [searchTerm]);

  const fetchRoles = async () => {
    try {
      const data = await RolService.getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error cargando roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // =========================
  // ACCIONES
  // =========================

  const abrirCrear = () => {
    setEmpleadoSeleccionado(null);
    setNombre(''); setApellido(''); setDni(''); setDireccion(''); setMail(''); setTelefono(''); setRolId('');
    setActiveModal('ADD');
  };

  const abrirEditar = (emp: any) => {
    setEmpleadoSeleccionado(emp);
    setNombre(emp.nombre || '');
    setApellido(emp.apellido || '');
    setDni(emp.dni || '');
    setDireccion(emp.direccion || '');
    setMail(emp.mail ?? emp.usuario?.email ?? '');
    setTelefono(emp.telefono || '');
    setRolId(emp.usuario?.rol?.id ?? '');
    setActiveModal('EDIT');
  };

  const abrirEliminar = (emp: Empleado) => {
    setEmpleadoSeleccionado(emp);
    setActiveModal('DELETE');
  };

  const guardarCambios = async () => {
    try {
      if (activeModal === 'ADD') {
        await EmpleadoService.crearEmpleado({ nombre, apellido, dni, direccion, mail, telefono, rolId });
      } else if (activeModal === 'EDIT' && empleadoSeleccionado) {
        await EmpleadoService.actualizarEmpleado(empleadoSeleccionado.id, { direccion, mail, telefono });
        if (empleadoSeleccionado.usuario?.id && rolId) {
          await UsuarioService.actualizarRolUsuario(empleadoSeleccionado.usuario.id, { rolId: Number(rolId) });
        }
      }
      setActiveModal(null);
      fetchEmpleados();
    } catch (error) {
      console.error("Error al procesar la solicitud");
    }
  };

  const confirmarEliminar = async () => {
    if (!empleadoSeleccionado) return;
    await EmpleadoService.eliminarEmpleado(empleadoSeleccionado.id);
    setActiveModal(null);
    fetchEmpleados();
  };

  return (
    <div className="space-y-8 animate-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de personal</h2>
          <p className="text-slate-500 font-medium mt-1">Administración de colaboradores y accesos</p>
        </div>
        <button
          onClick={abrirCrear}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-sm shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5" /> Nuevo colaborador
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DNI..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setSearchTerm('')}
          className="px-6 flex items-center justify-center bg-white text-slate-300 hover:text-rose-500 border border-slate-200 rounded-2xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      {loading ? (
        <div className="bg-white rounded-[40px] border border-slate-200 p-20 text-center flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando personal...</p>
        </div>
      ) : empleados.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-slate-200 p-20 text-center">
          <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No se encontraron empleados con estos filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {empleados.map((e: any) => (
            <div key={e.id} className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 flex flex-col group hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-[24px] bg-slate-900 flex items-center justify-center text-white font-bold text-2xl group-hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-100">
                  {e.nombre.charAt(0)}
                </div>
                <span className="px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 tracking-wider">
                  {e.usuario?.rol?.nombre ?? 'SIN ROL'}
                </span>
              </div>

              <div className="mb-6">
                <h4 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {e.nombre} {e.apellido}
                </h4>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">DNI: {e.dni}</p>
              </div>

              <div className="space-y-3 mb-8 border-t border-slate-50 pt-6">
                <div className="flex items-center gap-3 text-slate-500">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-semibold truncate">{e.mail ?? 'Sin mail'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Phone className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-semibold">{e.telefono ?? 'Sin teléfono'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-semibold truncate">{e.direccion ?? 'Sin dirección'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                <button onClick={() => abrirEditar(e)} className="py-4 bg-white border border-slate-200 rounded-[20px] text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 shadow-sm">
                  <Edit className="w-4 h-4" /> Editar
                </button>
                <button onClick={() => abrirEliminar(e)} className="py-4 bg-rose-50 text-rose-600 rounded-[20px] text-[11px] font-bold uppercase tracking-wider hover:bg-rose-100 transition-all flex items-center justify-center gap-2 border border-rose-100">
                  <Trash2 className="w-4 h-4" /> Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINACIÓN */}
      <div className="bg-white px-8 py-4 border border-slate-200 rounded-3xl flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider shadow-sm">
        <span>Página {paginaActual + 1} de {totalPaginas}</span>
        <div className="flex gap-2">
          <button 
            disabled={paginaActual === 0 || loading} 
            onClick={() => setPaginaActual(prev => prev - 1)} 
            className="p-2 border border-slate-200 bg-white text-slate-400 rounded-xl shadow-sm transition-all 
                 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50
                 active:scale-90 active:bg-indigo-100
                 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 disabled:hover:bg-white disabled:active:scale-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            disabled={paginaActual >= totalPaginas - 1 || loading} 
            onClick={() => setPaginaActual(prev => prev + 1)} 
            className="p-2 border border-slate-200 bg-white text-slate-400 rounded-xl shadow-sm transition-all 
                 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50
                 active:scale-90 active:bg-indigo-100
                 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 disabled:hover:bg-white disabled:active:scale-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MODAL CREAR/EDITAR */}
      {(activeModal === 'ADD' || activeModal === 'EDIT') && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-200 overflow-hidden select-none">
            
            {/* Encabezado del Modal*/}
            <div className="flex justify-between items-center border-b border-slate-50 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  {activeModal === 'ADD' ? <UserPlus className="w-6 h-6" /> : <Edit className="w-6 h-6" />}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">
                  {activeModal === 'ADD' ? 'Registrar Colaborador' : 'Editar Colaborador'}
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 text-slate-300 hover:text-slate-500 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cuerpo del Modal con Scroll */}
            <div className="max-h-[60vh] pr-2 space-y-6 px-2 pb-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
              
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                    Nombre <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    disabled={activeModal === 'EDIT'} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none disabled:opacity-60" 
                    placeholder="Ej: Juan" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                    Apellido <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    disabled={activeModal === 'EDIT'} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none disabled:opacity-60" 
                    placeholder="Ej: Pérez" 
                    value={apellido} 
                    onChange={(e) => setApellido(e.target.value)} 
                  />
                </div>
              </div>

              {/* DNI y Rol */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                    DNI <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    disabled={activeModal === 'EDIT'} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none disabled:opacity-60" 
                    placeholder="DNI" 
                    value={dni} 
                    onChange={(e) => setDni(e.target.value)} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                    Rol <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none" 
                    value={rolId} 
                    onChange={(e) => setRolId(Number(e.target.value))}
                  >
                    <option value="">Seleccionar...</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                  </select>
                </div>
              </div>

              {/* Email y Teléfono */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none" 
                    placeholder="Email" 
                    value={mail} 
                    onChange={(e) => setMail(e.target.value)} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                    Teléfono <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none" 
                    placeholder="Teléfono" 
                    value={telefono} 
                    onChange={(e) => setTelefono(e.target.value)} 
                  />
                </div>
              </div>

              {/* Dirección (Opcional) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Dirección</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none" 
                  placeholder="Dirección" 
                  value={direccion} 
                  onChange={(e) => setDireccion(e.target.value)} 
                />
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4 pt-6 border-t border-slate-50">
              <button 
                onClick={() => setActiveModal(null)} 
                className="flex-1 py-4 font-bold text-sm text-slate-400 hover:text-slate-600 uppercase tracking-widest"
              >
                Cerrar
              </button>
              <button 
                onClick={guardarCambios} 
                disabled={!nombre || !apellido || !dni || !rolId || !mail || !telefono}
                className="flex-[2] py-4 bg-indigo-600 text-white rounded-[20px] font-bold text-sm tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" /> 
                {activeModal === 'ADD' ? 'Registrar' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {activeModal === 'DELETE' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[40px] w-full max-w-md shadow-2xl text-center">
            <h3 className="text-xl font-bold text-rose-600 mb-2 uppercase tracking-tight">¿Eliminar registro?</h3>
            <p className="text-sm text-slate-500 mb-8 font-medium">Esta acción dará de baja a <b>{empleadoSeleccionado?.nombre} {empleadoSeleccionado?.apellido}</b>.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setActiveModal(null)} className="py-4 border border-slate-200 rounded-2xl text-slate-400 font-bold text-xs uppercase hover:bg-slate-50">Volver</button>
              <button onClick={confirmarEliminar} className="bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-rose-100">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Empleados;