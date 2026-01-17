
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Package, ChevronDown, ChevronRight, AlertCircle, Edit, Trash2, Save, X, ChevronLeft, Settings2 } from 'lucide-react';
import ProductoService from '../services/productoService.js';
import CategoriaService from '../services/categoriaService.js';
import ProveedorService from '../services/proveedorService.js';
import TalleService from '../services/talleService.js';
import ColorService from '../services/colorService.js';

const Productos: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'ADD_PRODUCT' | 'EDIT_PRODUCT' | 'ADD_VARIANT' | 'EDIT_VARIANT' | 'DELETE' | null>(null);

  const toggleProduct = (id: number) => setSelectedProduct((prevId) => (prevId === id ? null : id));

  // =======================
  // ELIMINACION
  // =======================

  const [itemToAction, setItemToAction] = useState<number | null>(null);
  const [typeToDelete, setTypeToDelete] = useState<'PRODUCTO' | 'VARIANTE' | null>(null);

  const confirmarEliminacion = async () => {
    if (!itemToAction || !typeToDelete) return;
    try {
      if (typeToDelete === 'PRODUCTO') {
        await ProductoService.eliminarProducto(itemToAction);
      } else if (typeToDelete === 'VARIANTE' && selectedProduct) {
        await ProductoService.eliminarDetalleProducto(selectedProduct, itemToAction);
      }
      setActiveModal(null);
      setItemToAction(null);
      setTypeToDelete(null);
      fetchProductos(); 
    } catch (error) {
      console.error("Error al eliminar", error);
    }
  };

  // =======================
  // CARGAR PRODUCTOS
  // =======================
  const [productos, setProductos] = useState<any[]>([]);
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterSubcategoria, setFilterSubcategoria] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        nombre: searchTerm,
        stockBajo: showLowStock || undefined,
        pagina: currentPage,
        categoriaId: filterCategoria || undefined,
        subcategoriaId: filterSubcategoria || undefined
      };
      const data = await ProductoService.getProductos(filters);
      setProductos(data.content || []); 
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, showLowStock, currentPage, filterCategoria, filterSubcategoria]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProductos();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchProductos]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, showLowStock]);

  // =======================
  // CREAR PRODUCTOS
  // =======================
  const [categorias, setCategorias] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    subcategoriaId: '',
    proveedorId: '',
    precio: ''
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [catData, provData] = await Promise.all([
          CategoriaService.getCategorias(),
          ProveedorService.getProveedores()
        ]);
        setCategorias(catData);
        setProveedores(provData);
      } catch (error) {
        console.error("Error cargando datos iniciales");
      }
    };
    loadInitialData();
  }, []);

  const handleSaveProduct = async () => {
    try {
      const payload: any = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: formData.precio === '' ? null : Number(formData.precio),
        subcategoriaId: Number(formData.subcategoriaId),
        proveedorId: Number(formData.proveedorId) || null
      };
      await ProductoService.crearProducto(payload);
      setActiveModal(null);
      fetchProductos();
    } catch (error) {
      console.error("Error al crear producto");
    }
  };

  // =======================
  // ACTUALIZAR PRODUCTOS
  // =======================
  const [selectedCategoryInForm, setSelectedCategoryInForm] = useState('');

  useEffect(() => {
    if (activeModal === 'EDIT_PRODUCT' && itemToAction) {
      const productToEdit = productos.find(p => p.id === itemToAction);
      if (productToEdit) {
        setFormData({
          nombre: productToEdit.nombre || '',
          descripcion: productToEdit.descripcion || '',
          subcategoriaId: productToEdit.subcategoria?.id.toString() || '',
          proveedorId: productToEdit.proveedor?.id.toString() || '',
          precio: productToEdit.precio.toString() || ''
        });
      
        setSelectedCategoryInForm(productToEdit.subcategoria?.categoriaId?.toString() || '');
      }
    }
  }, [activeModal, itemToAction, productos]);

  const handleUpdateProduct = async () => {
    if (!itemToAction) return;
    try {
      const payload: any = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: formData.precio === '' ? null : Number(formData.precio),
        subcategoriaId: Number(formData.subcategoriaId),
        proveedorId: formData.proveedorId ? Number(formData.proveedorId) : null
      };
      await ProductoService.actualizarProducto(itemToAction, payload);
      setActiveModal(null);
      fetchProductos();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  // =======================
  // CREAR VARIANTES
  // =======================
  const [talles, setTalles] = useState<any[]>([]);
  const [colores, setColores] = useState<any[]>([]);

  const [variantFormData, setVariantFormData] = useState({
    talleId: '',
    colorId: '',
    stockActual: '',
    stockMinimo: ''
  });

  useEffect(() => {
    if (activeModal === 'ADD_VARIANT' || activeModal === 'EDIT_VARIANT') {
      const loadVariantData = async () => {
        try {
          const [talleData, colorData] = await Promise.all([
            TalleService.getTalles(),
            ColorService.getColores()
          ]);
          setTalles(talleData);
          setColores(colorData);
        } catch (error) {
          console.error("Error cargando talles o colores");
        }
      };
      loadVariantData();
    }
  }, [activeModal]);

  const handleSaveVariant = async () => {
    if (!selectedProduct) return;
    try {
      const payload = {
        talleId: Number(variantFormData.talleId) || null,
        colorId: Number(variantFormData.colorId) || null,
        stockActual: Number(variantFormData.stockActual),
        stockMinimo: Number(variantFormData.stockMinimo) || null
      };
      await ProductoService.crearDetalle(selectedProduct, payload);
      setActiveModal(null);
      fetchProductos();
    } catch (error) {
      console.error("Error al crear variante");
    }
  };

  // =======================
  // ACTUALIZAR VARIANTES
  // =======================
  useEffect(() => {
    if (activeModal === 'EDIT_VARIANT' && itemToAction && selectedProduct) {
      const product = productos.find(p => p.id === selectedProduct);
      const variant = product?.detalles?.find((d: any) => d.id === itemToAction);
      
      if (variant) {
        setVariantFormData({
          talleId: variant.talle?.id.toString() || '',
          colorId: variant.color?.id.toString() || '',
          stockActual: '',
          stockMinimo: variant.stockMinimo.toString()
        });
      }
    }
  }, [activeModal, itemToAction, selectedProduct, productos]);

  const handleUpdateVariant = async () => {
    try {
      const payload = {
        stockAumento: Number(variantFormData.stockActual),
        stockMinimo: Number(variantFormData.stockMinimo)
      };
      await ProductoService.actualizarDetalle(selectedProduct!, itemToAction!, payload);
      setActiveModal(null);
      setVariantFormData({ talleId: '', colorId: '', stockActual: '', stockMinimo: '' });
      fetchProductos();
    } catch (error) {
      console.error("Error al actualizar");
    }
  };

 //=========

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Catálogo de productos</h2>
          <p className="text-slate-500 font-medium mt-1">Gestiona inventario, variantes y stock mínimo</p>
        </div>
        <button onClick={() => setActiveModal('ADD_PRODUCT')} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-sm shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
          <Plus className="w-5 h-5" /> Nuevo producto
        </button>
      </div>

      {/* --- BARRA DE FILTROS --- */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Buscar producto */}
        <div className="space-y-1 lg:col-span-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Buscar productos</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Ingresa el nombre del producto..." 
              className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>
        {/* 2. Categoría */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Categoría</label>
          <select 
            value={filterCategoria} 
            onChange={e => { setFilterCategoria(e.target.value); setFilterSubcategoria(''); setCurrentPage(0); }} 
            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none"
          >
            <option value="">Todas</option>
            {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.descripcion}</option>)}
          </select>
        </div>
        {/* 3. Subcategoría */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Subcategoría</label>
          <select 
            disabled={!filterCategoria}
            value={filterSubcategoria} 
            onChange={e => { setFilterSubcategoria(e.target.value); setCurrentPage(0); }} 
            className={`w-full px-4 py-3.5 border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none ${!filterCategoria ? 'bg-slate-100 opacity-50' : 'bg-slate-50'}`}
          >
            <option value="">Todas</option>
            {categorias.find(c => c.id.toString() === filterCategoria)?.subcategorias.map((sub: any) => (
              <option key={sub.id} value={sub.id}>{sub.descripcion}</option>
            ))}
          </select>
        </div>
        {/* Botones de Acción */}
        <div className="space-y-1">
        
          <label className="text-[10px] font-bold text-transparent uppercase tracking-wide ml-1 select-none">Filtros</label>
          <div className="flex gap-2">
            <button 
              onClick={() => { setShowLowStock(!showLowStock); setCurrentPage(0); }} 
              className={`flex-1 h-[46px] rounded-xl text-[10px] font-bold uppercase transition-all border flex items-center justify-center gap-1.5 ${
                showLowStock 
                  ? 'bg-amber-100 text-amber-700 border-amber-200' 
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" /> Stock bajo
            </button>
            <button 
              onClick={() => { 
                setSearchTerm(''); setFilterCategoria(''); setFilterSubcategoria(''); setShowLowStock(false); setCurrentPage(0); 
              }}
              className="w-[46px] h-[46px] flex items-center justify-center bg-white text-slate-300 hover:text-rose-500 border border-slate-200 rounded-xl transition-all"
              title="Limpiar filtros"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
        {loading ? (
          <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="p-20 text-center">
            <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No se encontraron productos con estos filtros.</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-slate-50 text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-6 w-12"></th>
                <th className="px-6 py-6">Producto</th>
                <th className="px-6 py-6">Proveedor</th>
                <th className="px-6 py-6 text-center">Total</th>
                <th className="px-6 py-6 text-right">Precio</th>
                <th className="px-6 py-6 w-32"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productos.map(product => {
                const totalStock = product.detalles?.reduce((acc: number, v: any) => acc + (v.stockActual || 0), 0) || 0;
                const isExpanded = selectedProduct === product.id;
                return (
                  <React.Fragment key={product.id}>
                    <tr onClick={() => toggleProduct(product.id)} className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-indigo-50/20' : ''}`}>
                      <td className="px-6 py-8 text-center">{isExpanded ? <ChevronDown className="w-6 h-6 text-indigo-600" /> : <ChevronRight className="w-6 h-6 text-slate-300" />}</td>
                      <td className="px-6 py-8">
                        <div>
                          <p className="font-bold text-slate-900 text-lg leading-tight">{product.nombre}</p>
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-1">{product.subcategoria?.categoriaDescripcion || 'Sin categoría'} • {product.subcategoria?.descripcion || 'Sin subcategoría'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-8"><span className="text-base font-semibold text-slate-600">{product.proveedor?.nombre || "Sin proveedor"}</span></td>
                      <td className="px-6 py-8 text-center font-bold text-slate-700 text-lg">{totalStock}</td>
                      <td className="px-6 py-8 text-right font-bold text-slate-900 text-lg">${product.precio}</td>
                      <td className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setItemToAction(product.id); setActiveModal('EDIT_PRODUCT'); }} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                            <Edit className="w-6 h-6" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setItemToAction(product.id); setTypeToDelete('PRODUCTO'); setActiveModal('DELETE'); }} className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-50/30">
                        <td colSpan={6} className="px-4 py-8 md:px-10">
                          {/* Tabla de variantes interna */}
                          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-x-auto">
                            <div className="bg-slate-50 px-8 py-5 flex justify-between items-center border-b border-slate-100">
                              <span className="text-sm text-slate-500 font-bold uppercase tracking-widest">Variantes de stock</span>
                              <button onClick={() => setActiveModal('ADD_VARIANT')} className="text-indigo-600 text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:text-indigo-800">
                                <Plus className="w-5 h-5" /> Agregar variante
                              </button>
                            </div>
                            <table className="w-full text-left text-base">
                              <thead className="bg-white text-xs text-slate-400 font-bold uppercase tracking-widest border-b border-slate-50">
                                <tr>
                                  <th className="px-8 py-5">SKU</th>
                                  <th className="px-8 py-5">Color/Talle</th>
                                  <th className="px-8 py-5 text-center">Disponible</th>
                                  <th className="px-8 py-5 text-center">Reservado</th>
                                  <th className="px-8 py-5 text-center">Mínimo</th>
                                  <th className="px-8 py-5 text-right">Acciones</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {product.detalles?.map((v: any) => (
                                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5 font-mono font-bold text-indigo-600 text-base">{v.codigo}</td>
                                    <td className="px-8 py-5 font-semibold text-slate-600">{v.color?.descripcion || 'Sin color'} / {v.talle?.descripcion || 'Sin talle'}</td>
                                    <td className="px-8 py-5 text-center font-bold text-slate-800">{v.stockDisponible}</td>
                                    <td className="px-8 py-5 text-center font-semibold text-slate-400">{v.stockReservado}</td>
                                    <td className="px-8 py-5 text-center font-bold text-amber-600">{v.stockMinimo}</td>
                                    <td className="px-8 py-5 text-right flex justify-end gap-3">
                                      <button onClick={() => { setItemToAction(v.id); setActiveModal('EDIT_VARIANT'); }} className="p-2 hover:text-indigo-600 transition-colors"><Settings2 className="w-5 h-5" /></button>
                                      <button onClick={() => { setItemToAction(v.id); setTypeToDelete('VARIANTE'); setActiveModal('DELETE'); }} className="p-2 hover:text-rose-600 transition-colors"><Trash2 className="w-5 h-5" /></button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

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

      {/* MODALES */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-200 overflow-hidden select-none">
            <div className="flex justify-between items-center border-b border-slate-50 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">
                  {activeModal === 'ADD_PRODUCT' ? 'Nuevo producto' : 
                   activeModal === 'EDIT_PRODUCT' ? 'Editar producto' :
                   activeModal === 'ADD_VARIANT' ? 'Nueva variante' :
                   activeModal === 'EDIT_VARIANT' ? 'Gestionar stock' : 'Eliminar registro'}
                </h3>
              </div>
              <button 
                onClick={() => { 
                  setActiveModal(null); 
                  setSelectedCategoryInForm('');
                  setVariantFormData({ talleId: '', colorId: '', stockActual: '', stockMinimo: '' });
                  setFormData({ nombre: '', descripcion: '', subcategoriaId: '', proveedorId: '', precio: '' });
                }}
                className="p-2 text-slate-300 hover:text-slate-500 transition-all"><X className="w-6 h-6" /></button>
            </div>

            <div className="max-h-[60vh] pr-2 space-y-6 px-2 pb-6">
              {(activeModal === 'ADD_PRODUCT' || activeModal === 'EDIT_PRODUCT') && (
                <div className="space-y-6"> 
                  {/* Nombre */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                      Nombre del producto <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      value={formData.nombre}
                      required
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Ej: Remera Básica Escote V Algodón Premium" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>

                  {/* Categoría y Subcategoría */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                        Categoría <span className="text-rose-500">*</span>
                      </label>
                      <select 
                        value={selectedCategoryInForm}
                        required
                        onChange={(e) => {
                          setSelectedCategoryInForm(e.target.value);
                          setFormData({...formData, subcategoriaId: ''});
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.descripcion}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                        Subcategoría <span className="text-rose-500">*</span>
                      </label>
                      <select 
                        disabled={!selectedCategoryInForm}
                        value={formData.subcategoriaId}
                        required
                        onChange={(e) => setFormData({...formData, subcategoriaId: e.target.value})}
                        className={`w-full border border-slate-200 rounded-2xl p-4 font-semibold text-sm outline-none transition-all ${!selectedCategoryInForm ? 'bg-slate-100 opacity-60' : 'bg-slate-50 focus:ring-4 focus:ring-indigo-500/10'}`}
                      >
                        <option value="">Seleccionar subcategoría</option>
                        {categorias.find(c => c.id.toString() === selectedCategoryInForm)?.subcategorias.map((sub: any) => (
                          <option key={sub.id} value={sub.id}>{sub.descripcion}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Precio y Proveedor */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Proveedor</label>
                      <select 
                        value={formData.proveedorId}
                        onChange={(e) => setFormData({...formData, proveedorId: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none"
                      >
                        <option value="">Seleccionar proveedor (Opcional)</option>
                        {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                        Precio ($) <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="number" 
                        value={formData.precio}
                        required
                        onChange={(e) => setFormData({...formData, precio: e.target.value})}
                        placeholder="0.00"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                      />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Descripción</label>
                    <textarea 
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      placeholder="Breve descripción del producto..." 
                      rows={3} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
              )}

              {(activeModal === 'ADD_VARIANT' || activeModal === 'EDIT_VARIANT') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {activeModal === 'ADD_VARIANT' && (
                    <>
                      {/* COLOR */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                          Color <span className="text-rose-500">*</span>
                        </label>
                        <select 
                          value={variantFormData.colorId}
                          onChange={(e) => setVariantFormData({...variantFormData, colorId: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10"
                        >
                          <option value="">Seleccionar color</option>
                          {colores.map(c => <option key={c.id} value={c.id}>{c.descripcion}</option>)}
                        </select>
                      </div>

                      {/* TALLE */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                          Talle <span className="text-rose-500">*</span>
                        </label>
                        <select 
                          value={variantFormData.talleId}
                          onChange={(e) => setVariantFormData({...variantFormData, talleId: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-semibold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10"
                        >
                          <option value="">Seleccionar talle</option>
                          {talles.map(t => <option key={t.id} value={t.id}>{t.descripcion}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  {/* STOCK ACTUAL / AUMENTO */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1 uppercase">
                      {activeModal === 'EDIT_VARIANT' ? 'Aumentar stock actual' : <>Stock inicial <span className="text-rose-500">*</span></>}
                    </label>
                    <input 
                      type="number" 
                      value={variantFormData.stockActual}
                      onChange={(e) => setVariantFormData({...variantFormData, stockActual: e.target.value})}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>

                  {/* STOCK MÍNIMO (OPCIONAL) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Alerta stock mínimo</label>
                    <input 
                      type="number" 
                      value={variantFormData.stockMinimo}
                      onChange={(e) => setVariantFormData({...variantFormData, stockMinimo: e.target.value})}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>
              )}

              {activeModal === 'DELETE' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-[30px] mx-auto flex items-center justify-center">
                    <AlertCircle className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight">¿Confirmar eliminación?</h4>
                    <p className="text-slate-500 text-sm">Esta acción no se puede deshacer y el registro será removido permanentemente del sistema.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-50">
              <button 
                onClick={() => { 
                  setActiveModal(null); 
                  setTypeToDelete(null); 
                  setSelectedCategoryInForm('');
                  setVariantFormData({ talleId: '', colorId: '', stockActual: '', stockMinimo: '' });
                  setFormData({ nombre: '', descripcion: '', subcategoriaId: '', proveedorId: '', precio: '' });
                }} 
                className="flex-1 py-4 font-bold text-sm text-slate-400 hover:text-slate-600 uppercase tracking-widest">Cerrar</button>
              <button 
                disabled={
                  (activeModal === 'ADD_PRODUCT' || activeModal === 'EDIT_PRODUCT') 
                    ? (!formData.nombre || !selectedCategoryInForm || !formData.subcategoriaId || !formData.precio)
                    : (activeModal === 'ADD_VARIANT')
                      ? (!variantFormData.colorId || !variantFormData.talleId || !variantFormData.stockActual)
                      : (activeModal === 'EDIT_VARIANT')
                        ? false
                        : false
                }
                onClick={() => { 
                  if (activeModal === 'DELETE') { 
                    confirmarEliminacion(); 
                  } else if (activeModal === 'ADD_PRODUCT') {
                    handleSaveProduct();
                  } else if (activeModal === 'EDIT_PRODUCT') {
                    handleUpdateProduct();
                  } else if (activeModal === 'ADD_VARIANT') {
                    handleSaveVariant();
                  } else if (activeModal === 'EDIT_VARIANT') {
                    handleUpdateVariant();
                  } else {
                    setActiveModal(null); 
                  }
                }}
                className={`flex-[2] py-4 rounded-[20px] font-bold text-sm tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 ${
                  activeModal === 'DELETE' 
                    ? 'bg-rose-600 text-white' 
                    : 'bg-indigo-600 text-white disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed'
                }`}
              >
                {activeModal === 'DELETE' ? <Trash2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {activeModal === 'DELETE' ? 'Confirmar eliminación' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;
