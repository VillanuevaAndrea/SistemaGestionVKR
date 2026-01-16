import { useEffect, useState, useCallback } from "react";
import ClienteService from "../services/clienteService.js";
import { ClienteEstado } from "../types.ts";
import {
  UserPlus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Save,
  UserCheck,
  UserX,
  CreditCard,
  Package,
  X
} from "lucide-react";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [activeModal, setActiveModal] = useState<"ADD" | "EDIT" | "DELETE" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true); // Inicializado en true como en Productos

  // =========================
  // PAGINACIÓN
  // =========================
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [clienteForm, setClienteForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    dni: "",
    creditoLimite: "",
    categoria: "CONFIABLE",
  });

  // =========================
  // CARGAR CLIENTES
  // =========================
  const [filterCategoria, setFilterCategoria] = useState<string>("");
  const nombresCategorias = {
    "CONFIABLE": "Confiable",
    "NO_CONFIABLE": "No confiable"
  };

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        nombre: searchTerm,
        pagina: currentPage,
        categoria: filterCategoria || undefined
      };
      const data = await ClienteService.getClientes(filters);
      setClientes(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      console.error("Error cargando clientes", e);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentPage, filterCategoria]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchClientes();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchClientes]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, filterCategoria]);

  // =========================
  // Crear / Editar
  // =========================
  const handleGuardarCliente = async () => {
    try {
      if (activeModal === "EDIT" && clienteSeleccionado) {
        await ClienteService.actualizarCliente(clienteSeleccionado.id, clienteForm);
      } else {
        await ClienteService.crearCliente(clienteForm);
      }
      setActiveModal(null);
      fetchClientes();
    } catch (e) {
      console.error("Error guardando cliente", e);
    }
  };

  // =========================
  // Eliminar
  // =========================
  const handleEliminarCliente = async () => {
    try {
      await ClienteService.eliminarCliente(clienteSeleccionado.id);
      setActiveModal(null);
      fetchClientes();
    } catch (e) {
      console.error("Error eliminando cliente", e);
    }
  };

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Gestión de Clientes
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Cartera de clientes y perfiles crediticios
          </p>
        </div>
        <button
          onClick={() => {
            setClienteForm({
              nombre: "",
              apellido: "",
              telefono: "",
              dni: "",
              creditoLimite: "",
              categoria: "CONFIABLE",
            });
            setActiveModal("ADD");
          }}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-sm shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Input de búsqueda (Ocupa 2 columnas) */}
        <div className="md:col-span-3 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DNI..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Botones de Filtro de Categoría */}
        <div className="flex gap-2 md:col-span-1">
          <button
            onClick={() => setFilterCategoria(filterCategoria === "CONFIABLE" ? "" : "CONFIABLE")}
            className={`flex-1 rounded-2xl text-[11px] font-bold uppercase transition-all border flex items-center justify-center gap-2 ${
              filterCategoria === "CONFIABLE"
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-lg shadow-emerald-50'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Confiables
          </button>

          <button
            onClick={() => setFilterCategoria(filterCategoria === "NO_CONFIABLE" ? "" : "NO_CONFIABLE")}
            className={`flex-1 rounded-2xl text-[11px] font-bold uppercase transition-all border flex items-center justify-center gap-2 ${
              filterCategoria === "NO_CONFIABLE"
                ? 'bg-rose-100 text-rose-700 border-rose-200 shadow-lg shadow-rose-50'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <UserX className="w-4 h-4" /> No confiables
          </button>

          {/* Botón Limpiar (X) */}
          <button 
            onClick={() => { setSearchTerm(''); setFilterCategoria(''); }}
            className="w-[56px] flex items-center justify-center bg-white text-slate-300 hover:text-rose-500 border border-slate-200 rounded-2xl transition-all"
            title="Limpiar filtros"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cards - CON LÓGICA DE LOADING IGUAL A PRODUCTOS */}
      {loading ? (
        <div className="bg-white rounded-[40px] border border-slate-200 p-20 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando clientes...</p>
        </div>
      ) : clientes.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-slate-200 p-20 text-center">
          <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No se encontraron clientes con estos filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 flex flex-col group hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-white font-bold text-2xl shadow-lg
                  ${
                    cliente.categoriaCliente === ClienteEstado.CONFIABLE
                      ? "bg-indigo-600 shadow-indigo-100"
                      : "bg-slate-400 shadow-slate-100"
                  }`}
                >
                  {cliente.nombre.charAt(0)}
                </div>

                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5
                  ${
                    cliente.categoriaCliente === ClienteEstado.CONFIABLE
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {cliente.categoriaCliente === ClienteEstado.CONFIABLE ? (
                    <UserCheck className="w-3.5 h-3.5" />
                  ) : (
                    <UserX className="w-3.5 h-3.5" />
                  )}
                  {nombresCategorias[cliente.categoriaCliente] || cliente.categoriaCliente}
                </span>
              </div>

              <div className="mb-8">
                <h4 className="text-xl font-bold text-slate-900 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">
                  {cliente.nombre} {cliente.apellido}
                </h4>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  DNI: {cliente.dni} • TEL: {cliente.telefono}
                </p>
              </div>

              <div className="flex-1 border-t border-slate-50 pt-6 space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-3 h-3 text-indigo-500" />
                  Perfil de Crédito
                </p>

                <div className="bg-slate-50 p-5 rounded-[24px] space-y-3 border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Capacidad de Crédito
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                      ${cliente.creditoLimite}
                    </span>
                  </div>
                  <div className="h-px bg-slate-200/50"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Deuda Actual
                    </span>
                    <span
                      className={`font-bold text-sm ${
                        cliente.deuda > 0 ? "text-rose-600" : "text-slate-800"
                      }`}
                    >
                      ${cliente.deuda}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-10">
                <button
                  onClick={() => {
                    setClienteSeleccionado(cliente);
                    setClienteForm({
                      nombre: cliente.nombre,
                      apellido: cliente.apellido,
                      telefono: cliente.telefono,
                      dni: cliente.dni,
                      creditoLimite: cliente.creditoLimite,
                      categoria: cliente.categoriaCliente,
                    });
                    setActiveModal("EDIT");
                  }}
                  className="py-4 bg-white border border-slate-200 rounded-[20px] text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Edit className="w-4 h-4" /> Editar
                </button>

                <button
                  onClick={() => {
                    setClienteSeleccionado(cliente);
                    setActiveModal("DELETE");
                  }}
                  className="py-4 bg-rose-50 text-rose-600 rounded-[20px] text-[11px] font-bold uppercase tracking-wider hover:bg-rose-100 transition-all flex items-center justify-center gap-2 border border-rose-100"
                >
                  <Trash2 className="w-4 h-4" /> Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- COSITO FINAL DEL PAGINADO (EXACTAMENTE IGUAL A PRODUCTOS) --- */}
      <div className="bg-white px-8 py-4 border border-slate-200 rounded-3xl flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider shadow-sm">
        <span>Página {currentPage + 1} de {totalPages}</span>
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 0} 
            onClick={() => setCurrentPage(prev => prev - 1)} 
            className="p-2 border border-slate-200 bg-white text-slate-400 rounded-xl shadow-sm transition-all 
                 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50
                 active:scale-90 active:bg-indigo-100
                 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 disabled:hover:bg-white disabled:active:scale-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            disabled={currentPage >= totalPages - 1} 
            onClick={() => setCurrentPage(prev => prev + 1)} 
            className="p-2 border border-slate-200 bg-white text-slate-400 rounded-xl shadow-sm transition-all 
                 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50
                 active:scale-90 active:bg-indigo-100
                 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 disabled:hover:bg-white disabled:active:scale-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modales ADD / EDIT */}
      {(activeModal === "ADD" || activeModal === "EDIT") && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-200 overflow-hidden select-none">
            
            {/* Encabezado del Modal */}
            <div className="flex justify-between items-center border-b border-slate-50 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">
                  {activeModal === "ADD" ? "Nuevo Cliente" : "Editar Cliente"}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-2 text-slate-300 hover:text-slate-500 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cuerpo del Modal con Scroll */}
            <div className="max-h-[60vh] pr-2 space-y-6 px-2 pb-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
              
              {/* Nombre y Apellido en Grilla */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                    Nombre <span className="text-rose-500">*</span>
                  </label>
                  <input
                    placeholder="Ej: Juan"
                    value={clienteForm.nombre}
                    onChange={(e) => setClienteForm({ ...clienteForm, nombre: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                    Apellido <span className="text-rose-500">*</span>
                  </label>
                  <input
                    placeholder="Ej: Pérez"
                    value={clienteForm.apellido}
                    onChange={(e) => setClienteForm({ ...clienteForm, apellido: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none"
                  />
                </div>
              </div>

              {/* Teléfono y DNI en Grilla */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                    Teléfono <span className="text-rose-500">*</span>
                  </label>
                  <input
                    placeholder="Ej: 1122334455"
                    value={clienteForm.telefono}
                    onChange={(e) => setClienteForm({ ...clienteForm, telefono: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                    DNI <span className="text-rose-500">*</span>
                  </label>
                  <input
                    placeholder="Ej: 40123456"
                    value={clienteForm.dni}
                    onChange={(e) => setClienteForm({ ...clienteForm, dni: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none"
                  />
                </div>
              </div>

              {/* Límite de Crédito y Categoría (Sin asterisco) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Límite de Crédito ($)</label>
                  <input
                    type="number"
                    placeholder="0,00"
                    value={clienteForm.creditoLimite}
                    onChange={(e) => setClienteForm({ ...clienteForm, creditoLimite: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Categoría Inicial</label>
                  <select
                    value={clienteForm.categoria}
                    onChange={(e) => setClienteForm({ ...clienteForm, categoria: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none"
                  >
                    <option value="CONFIABLE">CONFIABLE</option>
                    <option value="NO_CONFIABLE">NO CONFIABLE</option>
                  </select>
                </div>
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
                onClick={handleGuardarCliente}
                disabled={!clienteForm.nombre || !clienteForm.apellido || !clienteForm.telefono || !clienteForm.dni}
                className="flex-[2] py-4 bg-indigo-600 text-white rounded-[20px] font-bold text-sm tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Guardar cliente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal DELETE */}
      {activeModal === "DELETE" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-200">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-[30px] mx-auto flex items-center justify-center">
                <Trash2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-slate-900 tracking-tight">¿Eliminar cliente?</h4>
                <p className="text-slate-500 text-sm">
                  Estás por eliminar a <span className="font-bold text-slate-700">{clienteSeleccionado?.nombre} {clienteSeleccionado?.apellido}</span>. <br /> Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-4 font-bold text-sm text-slate-400 uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminarCliente}
                className="flex-[2] py-4 bg-rose-600 text-white rounded-[20px] font-bold text-sm tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95"
              >
                Confirmar Eliminación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
