import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { 
  Save, Building2, AlertTriangle, Plus, Trash2, Shield, Layers, Tag, Palette, Ruler, Truck, ChevronRight,
  CheckSquare, Square, CalendarDays, Bell, MessageCircle, Mail,
  Pencil, Eye,
  X
} from 'lucide-react';
import ConfiguracionService from '../services/configuracionService.js';
import CategoriaService from '../services/categoriaService.js';
import ColorService from '../services/colorService.js';
import TalleService from '../services/talleService.js';
import ProveedorService from '../services/proveedorService.js';
import RolService from '../services/rolService.js';
import PermisoService from '../services/permisoService.js';
import SubcategoriaService from '../services/subcategoriaService.js';

const Configuracion: React.FC = () => {
  const { tienePermiso } = useAuth();
  const [activeCatalog, setActiveCatalog] = useState<'GENERAL' | 'CATALOGOS'>('GENERAL');
  const [selectedSubCatalog, setSelectedSubCatalog] = useState<'ROLES' | 'CATEGORIAS' | 'SUBCATEGORIAS' | 'COLORES' | 'TALLES' | 'PROVEEDORES'>('CATEGORIAS');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Nuevo estado para controlar modo lectura/edición

  const getSingularName = (catalog) => {
    const singulars = {
      'CATEGORIAS': 'Categoría',
      'SUBCATEGORIAS': 'Subcategoría',
      'COLORES': 'Color',
      'TALLES': 'Talle',
      'PROVEEDORES': 'Proveedor',
      'ROLES': 'Rol'
    };
    return singulars[catalog] || catalog;
  };

  const PERMISOS_MAP = {
    CATEGORIAS: { crear: 'CATEGORIA_CREAR', eliminar: 'CATEGORIA_ELIMINAR' },
    SUBCATEGORIAS: { crear: 'SUBCATEGORIA_CREAR', eliminar: 'SUBCATEGORIA_ELIMINAR' },
    COLORES: { crear: 'COLOR_CREAR', eliminar: 'COLOR_ELIMINAR' },
    TALLES: { crear: 'TALLE_CREAR', eliminar: 'TALLE_ELIMINAR' },
    PROVEEDORES: { crear: 'PROVEEDOR_CREAR', eliminar: 'PROVEEDOR_ELIMINAR' },
    ROLES: { ver: 'ROL_VER', crear: 'ROL_CREAR', eliminar: 'ROL_ELIMINAR', editar: 'ROL_ACTUALIZAR' }
  };

  useEffect(() => {
    if (!tienePermiso('CONFIGURACION_EDITAR')) {
      setActiveCatalog('CATALOGOS');
    }
    setLoading(false);
  }, [tienePermiso]);

  // =======================
  // ELIMINAR ITEMS
  // =======================  
  const [itemParaEliminar, setItemParaEliminar] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const preHandleDelete = (item: any) => {
    setItemParaEliminar(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
      if (!itemParaEliminar) return;
      try {
          const id = itemParaEliminar.id;
          if (itemParaEliminar.categoriaId) {
              await SubcategoriaService.eliminarSubcategoria(id);
          } else {
              switch (selectedSubCatalog) {
                  case 'CATEGORIAS': await CategoriaService.eliminarCategoria(id); break;
                  case 'COLORES': await ColorService.eliminarColor(id); break;
                  case 'TALLES': await TalleService.eliminarTalle(id); break;
                  case 'PROVEEDORES': await ProveedorService.eliminarProveedor(id); break;
                  case 'ROLES': await RolService.eliminarRol(id); break;
              }
          }
          fetchMasterData();
          setShowDeleteModal(false);
          setItemParaEliminar(null);
      } catch (error) {
          console.error("Error eliminando:", error);
      }
  };

  // =======================
  // CARGAR CONFIGURACION
  // =======================
  const [generalConfig, setGeneralConfig] = useState({
    nombreEmpresa: '',
    eslogan: '',
    permiteReserva: true,
    porcentajeMinimoSena: 0,
    diasValidezReserva: 0,
    stockMinimoGlobal: 0,
    diasMaximoCancelacion: 0
  });

  const fetchConfig = useCallback(async () => {
    if (!tienePermiso('CONFIGURACION_EDITAR')) return;
    
    setLoading(true);
    try {
      const data = await ConfiguracionService.getConfiguracion();
      setGeneralConfig(data);
    } catch (error) {
      console.error("Error cargando configuración", error);
    } finally {
      setLoading(false);
    }
  }, [tienePermiso]);

  useEffect(() => {
    if (activeCatalog === 'GENERAL') {
      fetchConfig();
    }
  }, [fetchConfig, activeCatalog]);

  // =======================
  // ACTUALIZAR CONFIGURACION
  // =======================
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const handleSaveGeneralConfig = async () => {
    try {
      const payload = {
        ...generalConfig,
        porcentajeMinimoSena: generalConfig.porcentajeMinimoSena / 100
      };
      await ConfiguracionService.actualizarConfiguracion(payload);
    
      window.dispatchEvent(new Event('configUpdated'));

      setSuccessMessage("Los datos del negocio se actualizaron correctamente.");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al actualizar", error);
    }
  };

  // =======================
  // CARGAR CATALOGO MAESTRO
  // =======================
  const [masterData, setMasterData] = useState<any[]>([]);
  const [loadingMaster, setLoadingMaster] = useState(false);
  const [allPermisos, setAllPermisos] = useState<any[]>([]);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);

  const fetchMasterData = useCallback(async () => {
    setLoadingMaster(true);
    try {
      let data = [];
      switch (selectedSubCatalog) {
        case 'CATEGORIAS': data = await CategoriaService.getCategorias(); break;
        case 'COLORES': data = await ColorService.getColores(); break;
        case 'TALLES': data = await TalleService.getTalles(); break;
        case 'PROVEEDORES': data = await ProveedorService.getProveedores(); break;
        case 'ROLES': 
          data = await RolService.getRoles();
          const perms = await PermisoService.getPermisos();
          setAllPermisos(perms);
          break;
        case 'SUBCATEGORIAS':
          const cats = await CategoriaService.getCategorias();
          data = cats.flatMap((c: any) => c.subcategorias.map((s: any) => ({...s, parentName: c.descripcion})));
          break;
      }
      setMasterData(data);
    } catch (error) {
      console.error("Error cargando maestro:", error);
    } finally {
      setLoadingMaster(false);
    }
  }, [selectedSubCatalog]);

  useEffect(() => {
      if (activeCatalog === 'CATALOGOS') fetchMasterData();
  }, [fetchMasterData, activeCatalog]);

  useEffect(() => {
    setExpandedCategoryId(null);
  }, [selectedSubCatalog]);

  // =======================
  // CREAR ITEMS
  // =======================  
  const [newItemName, setNewItemName] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState('');

  const handleCreateItem = async () => {
    try {
      if (parentCategoryId) {
        await SubcategoriaService.crearSubcategoria({ 
          descripcion: newItemName, 
          categoriaId: Number(parentCategoryId) 
        });
        setSuccessMessage("Subcategoría creada con éxito.");
      } else {
        switch (selectedSubCatalog) {
          case 'CATEGORIAS': await CategoriaService.crearCategoria({ descripcion: newItemName }); break;
          case 'COLORES': await ColorService.crearColor({ descripcion: newItemName }); break;
          case 'TALLES': await TalleService.crearTalle({ descripcion: newItemName }); break;
          case 'PROVEEDORES': await ProveedorService.crearProveedor({ nombre: newItemName }); break;
          case 'ROLES': await RolService.crearRol({ nombre: newItemName, permisos: [] }); break;
        }
      }
      setNewItemName('');
      setParentCategoryId('');
      setShowAddModal(false);
      fetchMasterData();
    } catch (error) {
      console.error("Error al crear item");
    }
  };

  // =======================
  // CARGAR CATEGORIAS
  // =======================  
  const [listaCategoriasPadre, setListaCategoriasPadre] = useState<any[]>([]);

  useEffect(() => {
    const loadCats = async () => {
      const data = await CategoriaService.getCategorias();
      setListaCategoriasPadre(data);
    };
    loadCats();
  }, []);

  // =======================
  // ACTUALIZAR ROLES
  // =======================  
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [tempPermisos, setTempPermisos] = useState([]);

  const handleOpenEditPermissions = (rol) => {
    setEditingRole(rol);
    setTempPermisos(rol.permisos.map(p => p.codigo)); 
    setShowPermissionsModal(true);
    setIsEditing(false); 
  };

  const handleToggleTempPermiso = (permisoCodigo) => {
    if (!isEditing) return; 
    setTempPermisos(prev => 
      prev.includes(permisoCodigo) 
        ? prev.filter(c => c !== permisoCodigo) 
        : [...prev, permisoCodigo]
    );
  };

  const handleSavePermissions = async () => {
    try {
      await RolService.actualizarPermisos(editingRole.id, { permisos: tempPermisos });
      await fetchMasterData();
      setShowPermissionsModal(false);
      setEditingRole(null);
      setSuccessMessage("Los permisos del rol han sido sincronizados.");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al guardar permisos definitivos:", error);
    }
  };

return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Configuración</h2>
          <p className="text-slate-500 font-medium mt-1">Personaliza el motor de negocio y maestros</p>
        </div>
        <div className="bg-white p-1.5 rounded-[24px] border border-slate-200 shadow-sm flex items-center">
          {tienePermiso('CONFIGURACION_EDITAR') && (
            <button 
              onClick={() => setActiveCatalog('GENERAL')} 
              className={`px-8 py-3 rounded-[18px] text-sm font-bold transition-all ${activeCatalog === 'GENERAL' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Ajustes generales
            </button>
          )}
          <button 
            onClick={() => setActiveCatalog('CATALOGOS')} 
            className={`px-8 py-3 rounded-[18px] text-sm font-bold transition-all ${activeCatalog === 'CATALOGOS' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Catálogos maestros
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cargando configuración...</p>
        </div>
      ) : activeCatalog === 'GENERAL' ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* BLOQUE IZQUIERDO: DATOS DEL NEGOCIO */}
            <div className="bg-white p-8 lg:p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col h-full">
              <h4 className="text-lg font-bold text-slate-900 tracking-tight mb-8 flex items-center gap-3">
                <Building2 className="w-5 h-5 text-indigo-600" /> Datos del negocio
              </h4>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 tracking-tight ml-1 mb-2 block">Razón social</label>
                  <input 
                    type="text" 
                    value={generalConfig.nombreEmpresa} 
                    onChange={e => setGeneralConfig({...generalConfig, nombreEmpresa: e.target.value})} 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 tracking-tight ml-1 mb-2 block">Eslogan</label>
                  <input 
                    type="text" 
                    value={generalConfig.eslogan} 
                    onChange={e => setGeneralConfig({...generalConfig, eslogan: e.target.value})} 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all" 
                  />
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: APILADOS (INVENTARIO + RESERVAS) */}
            <div className="space-y-8">
              {/* GESTIÓN DE INVENTARIO */}
              <div className="bg-white p-8 lg:p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col">
                <h4 className="text-lg font-bold text-slate-900 tracking-tight mb-8 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500" /> Gestión de inventario
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-slate-700 tracking-tight ml-1 mb-2 block">Alerta de stock</label>
                    <input 
                      type="number" 
                      value={generalConfig.stockMinimoGlobal} 
                      onChange={e => setGeneralConfig({...generalConfig, stockMinimoGlobal: Number(e.target.value)})} 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black text-slate-900 focus:bg-white outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 tracking-tight ml-1 mb-2 block">Días de cancelación</label>
                    <input 
                      type="number" 
                      value={generalConfig.diasMaximoCancelacion} 
                      onChange={e => setGeneralConfig({...generalConfig, diasMaximoCancelacion: Number(e.target.value)})} 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black text-slate-900 focus:bg-white outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>

              {/* POLÍTICAS DE RESERVA */}
              <div className="bg-white p-8 lg:p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-3">
                    <CalendarDays className="w-5 h-5 text-indigo-600" /> Políticas de reserva
                  </h4>
                  <div 
                    onClick={() => setGeneralConfig({...generalConfig, permiteReserva: !generalConfig.permiteReserva})}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                      {generalConfig.permiteReserva ? 'Habilitado' : 'Deshabilitado'}
                    </span>
                    <div className={`w-12 h-6 rounded-full transition-all relative ${generalConfig.permiteReserva ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${generalConfig.permiteReserva ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </div>
                </div>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all ${!generalConfig.permiteReserva ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
                  <div>
                    <label className="text-sm font-bold text-slate-700 tracking-tight ml-1 mb-2 block">Seña mínima (%)</label>
                    <input 
                      type="number" 
                      value={generalConfig.porcentajeMinimoSena * 100} 
                      onChange={e => setGeneralConfig({...generalConfig, porcentajeMinimoSena: Number(e.target.value) / 100})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black text-indigo-600 focus:bg-white outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 tracking-tight ml-1 mb-2 block">Días de validez</label>
                    <input 
                      type="number" 
                      value={generalConfig.diasValidezReserva}
                      onChange={e => setGeneralConfig({...generalConfig, diasValidezReserva: Number(e.target.value)})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black text-indigo-600 focus:bg-white outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            {tienePermiso('CONFIGURACION_EDITAR') && (
              <button 
                onClick={handleSaveGeneralConfig}
                className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-bold text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                <Save className="w-5 h-5" /> Guardar cambios
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
          <div className="lg:col-span-3 space-y-3">
            {[
              { id: 'CATEGORIAS', icon: Layers, label: 'Categorías', permiso: 'CATEGORIA_CREAR' },
              { id: 'COLORES', icon: Palette, label: 'Colores', permiso: 'COLOR_CREAR' },
              { id: 'TALLES', icon: Ruler, label: 'Talles', permiso: 'TALLE_CREAR' },
              { id: 'PROVEEDORES', icon: Truck, label: 'Proveedores', permiso: 'PROVEEDOR_CREAR' },
              { id: 'ROLES', icon: Shield, label: 'Roles', permiso: 'ROL_VER' },
            ]
            .filter(sub => tienePermiso(sub.permiso))
            .map((sub) => (
              <button 
                key={sub.id} 
                onClick={() => setSelectedSubCatalog(sub.id as any)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-[24px] text-sm font-bold tracking-tight transition-all
                  ${selectedSubCatalog === sub.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-300 hover:text-slate-600'}
                `}
              >
                <div className="flex items-center gap-4">
                  <sub.icon className="w-4 h-4" />
                  {sub.label}
                </div>
                {selectedSubCatalog === sub.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </div>

          <div className="lg:col-span-9 bg-white p-8 lg:p-12 rounded-[40px] border border-slate-200 shadow-sm flex flex-col min-h-[600px]">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h4 className="text-sm font-bold text-slate-400 tracking-tight mb-1">Maestro de datos</h4>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{selectedSubCatalog}</h3>
              </div>
              {tienePermiso(PERMISOS_MAP[selectedSubCatalog].crear) && (
                <button onClick={() => setShowAddModal(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-[18px] font-bold text-sm tracking-tight flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
                  <Plus className="w-4 h-4" /> Nuevo registro
                </button>
              )}
            </div>

            <div className="flex-1 space-y-3">
              {loadingMaster ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cargando registros...</p>
                </div>
              ) : masterData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Layers className="w-12 h-12 text-slate-200 mb-4" />
                  <p className="text-slate-400 font-medium">No hay registros en este catálogo.</p>
                </div>
              ) : masterData.map(item => (
                <div key={item.id} className="group flex flex-col bg-slate-50 rounded-[30px] border border-transparent hover:border-indigo-100 transition-all overflow-hidden">
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {selectedSubCatalog === 'CATEGORIAS' && (
                        <button 
                          onClick={() => setExpandedCategoryId(expandedCategoryId === item.id ? null : item.id)}
                          className={`p-2 rounded-xl transition-all ${expandedCategoryId === item.id ? 'bg-indigo-600 text-white rotate-90' : 'bg-white text-slate-400'}`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-800 text-lg tracking-tight">{item.descripcion || item.nombre}</span>
                        {selectedSubCatalog === 'ROLES' && (
                          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">
                            <span className="text-[10px] font-black uppercase tracking-wider">{[...new Set(item.permisos?.map((p: any) => p.codigo))].length} Permisos</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {selectedSubCatalog === 'ROLES' && tienePermiso('ROL_ACTUALIZAR') && (
                        <button 
                          onClick={() => handleOpenEditPermissions(item)} 
                          className="p-3 bg-white text-slate-300 hover:text-indigo-600 rounded-xl border border-slate-100 shadow-sm transition-all"
                          title="Ver detalle"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      )}
                      {tienePermiso(PERMISOS_MAP[selectedSubCatalog].eliminar) && (
                        <button onClick={() => preHandleDelete(item)} className="p-3 bg-white text-slate-300 hover:text-rose-600 rounded-xl border border-slate-100 shadow-sm transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  {selectedSubCatalog === 'CATEGORIAS' && expandedCategoryId === item.id && (
                    <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                      <div className="bg-white rounded-[24px] border border-slate-100 p-5 space-y-4 shadow-inner">
                        <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-2">
                            <Tag className="w-3 h-3 text-indigo-400" />
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subcategorías</h5>
                          </div>
                          {tienePermiso(PERMISOS_MAP["SUBCATEGORIAS"].crear) && (
                          <button 
                            onClick={() => { setParentCategoryId(item.id); setShowAddModal(true); }}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 bg-indigo-50 px-4 py-1.5 rounded-full transition-all"
                          >
                            <Plus className="w-3 h-3" /> Añadir registro
                          </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {item.subcategorias?.length > 0 ? (
                            item.subcategorias.map((sub: any) => (
                              <div key={sub.id} className="flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 px-5 py-3.5 rounded-[18px] group/sub transition-colors border border-transparent hover:border-slate-200">
                                <span className="text-sm font-bold text-slate-600">{sub.descripcion}</span>
                                {tienePermiso(PERMISOS_MAP['SUBCATEGORIAS'].eliminar) && (
                                <button 
                                  onClick={() => { setItemParaEliminar(sub); setShowDeleteModal(true); }}
                                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="py-8 text-center bg-slate-50/50 rounded-[20px] border border-dashed border-slate-200">
                              <p className="text-[11px] text-slate-400 font-medium italic">Sin subcategorías vinculadas.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODALES */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl p-12 space-y-10 animate-in zoom-in duration-300">
            <div className="text-center">
              <h4 className="text-sm font-bold text-slate-400 tracking-tight mb-2">Acción de catálogo</h4>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Agregar {parentCategoryId ? 'subcategoría' : getSingularName(selectedSubCatalog)}</h3>
            </div>
            <div className="space-y-6">
              {selectedSubCatalog === 'SUBCATEGORIAS' && (
                <div>
                  <label className="text-sm font-bold text-slate-700 tracking-tight mb-2 block ml-1">Categoría padre</label>
                  <select 
                    value={parentCategoryId}
                    onChange={(e) => setParentCategoryId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[24px] p-5 font-bold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none"
                  >
                    <option value="">Seleccionar categoría...</option>
                    {listaCategoriasPadre.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.descripcion}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="text-sm font-bold text-slate-700 tracking-tight mb-2 block ml-1">{selectedSubCatalog === 'PROVEEDORES' ? 'Nombre / Razón Social' : 'Descripción'}</label>
                <input 
                  type="text" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Ej: Nueva Colección..." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-[24px] p-5 font-bold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none" 
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setShowAddModal(false); setNewItemName(''); setParentCategoryId(''); }} className="flex-1 py-5 font-bold text-sm text-slate-400 tracking-tight">Cancelar</button>
              <button onClick={handleCreateItem} disabled={!newItemName || (selectedSubCatalog === 'SUBCATEGORIAS' && !parentCategoryId)} className="flex-[2] py-5 bg-indigo-600 text-white rounded-[24px] font-bold text-sm tracking-tight shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {showPermissionsModal && editingRole && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl max-h-[90vh] flex flex-col animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 lg:p-12 pb-6 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                    {isEditing ? `Editando permisos: ${editingRole.nombre}` : `Permisos de ${editingRole.nombre}`}
                </h3>
                <p className="text-slate-400 text-sm font-medium">
                    {isEditing ? "Los cambios se aplicarán al presionar guardar" : "Modo de solo lectura"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                        <Pencil className="w-4 h-4" /> Editar
                    </button>
                )}
                <button onClick={() => { setShowPermissionsModal(false); setEditingRole(null); }} className="p-3 bg-slate-100 text-slate-400 rounded-full hover:bg-slate-200">
                    <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 lg:p-12 pt-4 space-y-12 custom-scrollbar">
              {Array.from(new Set(allPermisos.map(p => p.codigo.split('_')[0]))).map(grupo => (
                <div key={grupo} className="space-y-4">
                  <h5 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Módulo {grupo}</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allPermisos.filter(p => p.codigo.startsWith(grupo)).map((perm) => {
                      const tienePermisoCheck = tempPermisos.includes(perm.codigo);
                      return (
                        <div 
                            key={perm.codigo} 
                            onClick={() => handleToggleTempPermiso(perm.codigo)} 
                            className={`flex items-center justify-between p-5 rounded-[24px] border transition-all 
                                ${isEditing ? 'cursor-pointer hover:border-indigo-200' : 'cursor-default opacity-80'} 
                                ${tienePermisoCheck ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50 border-transparent'}`}
                        >
                          <span className={`text-sm font-bold ${tienePermisoCheck ? 'text-indigo-700' : 'text-slate-600'}`}>{perm.descripcion}</span>
                          <div className={`transition-all transform ${tienePermisoCheck ? 'text-indigo-600 scale-110' : 'text-slate-300'}`}>
                            {tienePermisoCheck ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 lg:p-10 border-t border-slate-100 bg-slate-50/50 flex gap-4 justify-end">
              <button onClick={() => { setShowPermissionsModal(false); setEditingRole(null); }} className="px-8 py-4 rounded-2xl font-bold text-sm text-slate-400 hover:text-slate-600">
                  {isEditing ? 'Cancelar' : 'Cerrar'}
              </button>
              {isEditing && (
                <button onClick={handleSavePermissions} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">
                    Guardar cambios
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && itemParaEliminar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-200">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-[30px] mx-auto flex items-center justify-center">
                <Trash2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-slate-900 tracking-tight">¿Eliminar "{itemParaEliminar.descripcion || itemParaEliminar.nombre}"?</h4>
                <p className="text-slate-500 text-sm">Esta acción no se puede deshacer.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setShowDeleteModal(false); setItemParaEliminar(null); }} className="flex-1 py-4 font-bold text-sm text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Cancelar</button>
              <button onClick={confirmDelete} className="flex-[2] py-4 bg-rose-600 text-white rounded-[20px] font-bold text-sm tracking-widest hover:bg-rose-700 transition-all active:scale-95">Confirmar eliminación</button>
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
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-slate-900 text-white rounded-[20px] font-bold text-sm uppercase tracking-widest hover:bg-black active:scale-95 shadow-xl shadow-slate-200">Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuracion;