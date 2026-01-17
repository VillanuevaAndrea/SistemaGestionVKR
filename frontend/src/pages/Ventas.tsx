import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, Trash2, CreditCard, DollarSign, 
  ScanLine, List, Eye, ArrowLeft, RefreshCw, ChevronLeft, ChevronRight, 
  Package, History, PlusCircle, X, Calendar, Hash, Loader2,
  AlertCircle, Tag, Minus, Plus, CheckCircle2,
  CheckSquare
} from 'lucide-react';
import VentaService from '../services/ventaService.js';
import ProductoService from '../services/productoService.js';
import ClienteService from '../services/clienteService.js';

const Ventas: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as any;
    if (state?.view === 'POS') {
      setView('POS');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  // Estados de Control
  const [view, setView] = useState<'POS' | 'LIST' | 'DETAIL'>('LIST');
  const [loading, setLoading] = useState(true);
  const [ventas, setVentas] = useState<any[]>([]);
  const [selectedVenta, setSelectedVenta] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'PAYMENTS'>('DETAILS');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Estados POS
  const [cart, setCart] = useState<any[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [clientesSugeridos, setClientesSugeridos] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [skuSearch, setSkuSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ estado: '', direccion: 'DESC' });

  // Modales de Flujo
  const [showPostVentaModal, setShowPostVentaModal] = useState(false);
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [lastCreatedVenta, setLastCreatedVenta] = useState<any | null>(null);

  const [isExchangeMode, setIsExchangeMode] = useState(false);

  const ESTADOS_VENTA = {
    'VentaPagada': { label: 'Venta Pagada', color: 'bg-emerald-50 text-emerald-700' },
    'VentaReservada': { label: 'Venta Reservada', color: 'bg-indigo-50 text-indigo-700' },
    'VentaCancelada': { label: 'Venta Cancelada', color: 'bg-rose-50 text-rose-700' },
    'VentaRechazada': { label: 'Venta Rechazada', color: 'bg-amber-50 text-amber-700' },
    'VentaIniciada': { label: 'Venta Iniciada', color: 'bg-slate-100 text-slate-600' },
  };

  // Modales de mensaje exitoso
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // =====================
  // BÚSQUEDA DE CLIENTES 
  // =====================
  const fetchClientesSugeridos = useCallback(async () => {
    if (clientSearch.trim().length < 1 || selectedClient) {
      setClientesSugeridos([]);
      return;
    }
    try {
      const data = await ClienteService.getClientes({ nombre: clientSearch });
      setClientesSugeridos(data.content || []);
    } catch (e) {
      setClientesSugeridos([]);
    }
  }, [clientSearch, selectedClient]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchClientesSugeridos();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchClientesSugeridos]);

  // =========================
  // CARGA DE VENTAS
  // =========================
  const fetchVentas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await VentaService.getVentas({
        pagina: currentPage,
        direccion: filters.direccion,
        orden: "fecha",
        estado: filters.estado || undefined,
        cliente: searchTerm || undefined 
      });
      setVentas(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error cargando ventas:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, searchTerm]);

  useEffect(() => {
    if (view === 'LIST') {
      const delayDebounce = setTimeout(() => {
        fetchVentas();
      }, 500);

      return () => clearTimeout(delayDebounce);
    }
  }, [fetchVentas, view, searchTerm]);

  // =========================
  // ACCIONES POS
  // =========================
  const [isComingFromDetail, setIsComingFromDetail] = useState(false);

  const handleSkuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skuSearch) return;
    const sku = skuSearch.toUpperCase();
    try {
      const detalle = await ProductoService.getProductoByCodigo(sku);
      if (detalle) {
        setCart(prev => {
          const existing = prev.find(item => item.codigo === sku);
          if (existing) return prev.map(item => item.codigo === sku ? { ...item, cantidad: item.cantidad + 1 } : item);
          return [...prev, { 
            codigo: detalle.codigo, nombre: detalle.productoNombre, 
            precioUnitario: parseFloat(detalle.productoPrecio), 
            talle: detalle.talleNombre, color: detalle.colorNombre, cantidad: 1 
          }];
        });
        setSkuSearch('');
      }
    } catch (e) { console.error("Error: Producto no encontrado."); }
  };

  const updateQuantity = (codigo: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.codigo === codigo) {
        const newQty = Math.max(1, item.cantidad + delta);
        return { ...item, cantidad: newQty };
      }
      return item;
    }));
  };

  const handleConfirmarPedido = async () => {
    if (cart.length === 0) return;
    try {
      const payload = {
        clienteId: selectedClient?.id || null,
        detalles: cart.map(i => ({ codigo: i.codigo, cantidad: i.cantidad }))
      };

      if (isExchangeMode && selectedVenta) {
        const ventaResultante = await VentaService.procesarCambio(selectedVenta.id, {
          motivo: "Cambio de producto",
          detalles: payload.detalles
        });
        setLastCreatedVenta(ventaResultante);
        setIsComingFromDetail(false);
        setShowPostVentaModal(true); 
        setCart([]);
        setSelectedClient(null);
        setClientSearch('');
      } else {
        const nuevaVenta = await VentaService.crearVenta(payload);
        setLastCreatedVenta(nuevaVenta);
        setShowPostVentaModal(true);
        setCart([]);
        setSelectedClient(null);
        setClientSearch('');
      }
    } catch (e) { 
      console.error("Error en operación:", e); 
    }
  };

  // =========================
  // ACCIONES DETAILS
  // =========================
  const handleAccionVenta = async (accion: 'CANCELAR' | 'RECHAZAR') => {
    if (!selectedVenta) return;
    const motivo = "Acción realizada desde administración";
    
    try {
      if (accion === 'CANCELAR') await VentaService.cancelarVenta(selectedVenta.id, { motivo });
      if (accion === 'RECHAZAR') await VentaService.rechazarVenta(selectedVenta.id, { motivo });

      // Éxito
      setSuccessMessage(`La venta #${selectedVenta.id} ha sido ${accion === 'CANCELAR' ? 'cancelada' : 'rechazada'} correctamente.`);
      setShowSuccessModal(true);
      
      const actualizado = await VentaService.getVentaById(selectedVenta.id);
      setSelectedVenta(actualizado);
      fetchVentas();
    } catch (e) {
      console.error("Error en acción:", e);
    }
  };

  // =========================
  // PAGAR VENTA COMPLETA
  // =========================
  const [showPagoModal, setShowPagoModal] = useState(false);
  const METODOS_PAGO_MAP = {
    'EFECTIVO': 'Efectivo',
    'MERCADO_PAGO': 'Mercado Pago',
    'CREDITO': 'Tarjeta de Crédito'
  };

  const handlePagarVentaCompleta = async (metodo: string) => {
    if (!lastCreatedVenta) return;
    try {
      const payload = { metodoPago: metodo };
      await VentaService.pagarVenta(lastCreatedVenta.id, payload);
      
      setShowPagoModal(false);
      setShowPostVentaModal(false);

      setSuccessMessage(`¡Pago registrado con éxito!\nVenta #${lastCreatedVenta.id} pagada.`);
      setShowSuccessModal(true);
      
      if (isComingFromDetail) {
        const actualizada = await VentaService.getVentaById(lastCreatedVenta.id);
        setSelectedVenta(actualizada);
        setIsComingFromDetail(false);
      } else {
        setView('LIST');
      }
      
      fetchVentas();
    } catch (e) {
      console.error("Error al procesar el pago:", e);
    }
  };

  // =========================
  // RESERVAR VENTA
  // =========================
  const [montoReserva, setMontoReserva] = useState<string>('');

  const handleConfirmarReserva = async () => {
    if (!lastCreatedVenta || !montoReserva) return;
    
    try {
      const payload = { monto: parseFloat(montoReserva) };
      await VentaService.reservarVenta(lastCreatedVenta.id, payload);
      
      setShowReservaModal(false);
      setShowPostVentaModal(false);
      setMontoReserva('');

      setSuccessMessage(`¡Reserva confirmada!\nSe registró la seña para la venta #${lastCreatedVenta.id}.`);
      setShowSuccessModal(true);

      if (isComingFromDetail) {
        const actualizada = await VentaService.getVentaById(lastCreatedVenta.id);
        setSelectedVenta(actualizada);
        setIsComingFromDetail(false);
      } else {
        setView('LIST');
      }
      
      fetchVentas();
    } catch (e) {
      console.error("Error al reservar:", e);
    }
  };

  // =========================
  // LÓGICA DE CAMBIO
  // =========================
  const handleStartExchange = () => {
    if (selectedVenta) {
      setIsExchangeMode(true);
      setCart([]);
      
      setSelectedClient(selectedVenta.cliente);
      setClientSearch(
        selectedVenta.cliente?.nombre 
          ? `${selectedVenta.cliente.nombre} ${selectedVenta.cliente.apellido || ''}` 
          : 'Consumidor Final'
      );
      
      setView('POS');
    }
  };

  const handlePagarDesdeDetalle = () => {
    setIsComingFromDetail(true);
    setLastCreatedVenta(selectedVenta);
    setShowPagoModal(true);
  };

  const handleReservarDesdeDetalle = () => {
    setIsComingFromDetail(true);
    setLastCreatedVenta(selectedVenta);
    setShowReservaModal(true);
  };

  
  const subtotalCarrito = cart.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);


  const totalFinal = (showPostVentaModal || showPagoModal || showReservaModal) && lastCreatedVenta
    ? lastCreatedVenta.total
    : isExchangeMode && selectedVenta 
      ? Math.max(0, subtotalCarrito - selectedVenta.montoPagado) 
      : subtotalCarrito;

  return (
    <div className="space-y-8 animate-in h-full">
      {/*  HEADER */}
      {view !== 'DETAIL' && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{view === 'POS' ? 'Terminal de ventas' : 'Gestión de ventas'}</h2>
            <p className="text-slate-500 font-medium mt-1">{view === 'POS' ? 'Procesamiento en tiempo real' : 'Historial de transacciones'}</p>
          </div>
          <button onClick={() => { setView(view === 'POS' ? 'LIST' : 'POS'); setIsExchangeMode(false); }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-sm shadow-xl flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
            {view === 'POS' ? <><List className="w-5 h-5" /> Ver Historial</> : <><PlusCircle className="w-5 h-5" /> Nueva Venta</>}
          </button>
        </div>
      )}

      {/* LISTADO VENTAS */}
      {view === 'LIST' && (
        <div className="space-y-8">
          
<div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">

  <div className="space-y-1 lg:col-span-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Buscar por cliente</label>
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
      <input 
        placeholder="Ingresa el nombre del cliente..." 
        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
    </div>
  </div>


  <div className="space-y-1 lg:col-span-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Estado</label>
    <select 
      value={filters.estado} 
      onChange={e => setFilters({...filters, estado: e.target.value})} 
      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none"
    >
      <option value="">Todos</option>
      <option value="VentaPagada">Pagada</option>
      <option value="VentaReservada">Reservada</option>
      <option value="VentaCancelada">Cancelada</option>
      <option value="VentaRechazada">Rechazada</option>
    </select>
  </div>

  <div className="space-y-1 lg:col-span-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Orden</label>
    <select 
      value={filters.direccion} 
      onChange={e => setFilters({...filters, direccion: e.target.value})} 
      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none"
    >
      <option value="DESC">Más recientes</option>
      <option value="ASC">Más antiguos</option>
    </select>
  </div>

  
  <div className="space-y-1 lg:col-span-2">
    <label className="text-[10px] font-bold text-transparent uppercase tracking-wide ml-1 select-none">Acciones</label>
    <div className="flex gap-2">
      <button 
        onClick={() => {
          const nuevoEstado = filters.estado === 'VentaVencida' ? '' : 'VentaVencida';
          setFilters({...filters, estado: nuevoEstado});
          setCurrentPage(0);
        }}
        className={`flex-[1.2] h-[46px] rounded-xl text-[10px] font-bold uppercase transition-all border flex items-center justify-center gap-1.5 ${
          filters.estado === 'VentaVencida' 
            ? 'bg-rose-100 text-rose-700 border-rose-200 shadow-sm' 
            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <AlertCircle className="w-3.5 h-3.5" /> Vencidas
      </button>
      <button 
        onClick={async () => { 
          try {
            await VentaService.procesarVencidas();
            setSuccessMessage("Se han procesado todas las reservas vencidas y el stock ha sido devuelto al inventario.");
            setShowSuccessModal(true);
            fetchVentas(); 
          } catch (error) {
            console.error("Error al procesar vencidas", error);
          }
        }}
        className="flex-1 h-[46px] px-4 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-black transition-all flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Limpiar vencidas
      </button>
      <button 
        onClick={() => {setSearchTerm(''); setFilters({estado: '', direccion: 'DESC'});}} 
        className="w-[46px] h-[46px] flex items-center justify-center bg-white text-slate-300 hover:text-rose-500 border border-slate-200 rounded-xl transition-all"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
</div>

<div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
  {loading ? (
    <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando ventas...</p>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
          <tr><th className="px-8 py-6">ID Venta</th><th className="px-8 py-6">Fecha</th><th className="px-8 py-6">Cliente</th><th className="px-8 py-6 text-center">Estado</th><th className="px-8 py-6 text-right">Total</th><th className="px-8 py-6 w-20"></th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {ventas.map((v) => (
            <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-8 py-8 font-mono font-bold text-indigo-600 text-lg">#{v.id}</td>
              <td className="px-8 py-8 text-base font-semibold text-slate-500">{new Date(v.fecha).toLocaleDateString('es-AR')}</td>
              <td className="px-8 py-8 font-bold text-slate-900">{v.cliente?.nombre || 'Consumidor Final'}</td>
              <td className="px-8 py-8 text-center"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${ESTADOS_VENTA[v.estadoNombre]?.color || 'bg-slate-50'}`}>{ESTADOS_VENTA[v.estadoNombre]?.label || v.estadoNombre}</span></td>
              <td className="px-8 py-8 text-right font-black text-slate-900 text-xl">${v.total.toLocaleString()}</td>
              <td className="px-8 py-8 text-center"><button onClick={async () => { const det = await VentaService.getVentaById(v.id); setSelectedVenta(det); setView('DETAIL'); }} className="p-3 bg-white border border-slate-200 text-slate-300 hover:text-indigo-600 rounded-2xl transition-all shadow-sm active:scale-95"><Eye className="w-5 h-5" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
        </div>
      )}

      {/* TERMINAL POS */}
      {view === 'POS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-[600px] overflow-hidden pb-4">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <form onSubmit={handleSkuSubmit} className="relative">
              <ScanLine className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
              <input type="text" placeholder="INGRESAR CÓDIGO..." className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-[28px] font-mono text-lg lg:text-xl font-bold tracking-widest uppercase outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" value={skuSearch} onChange={(e) => setSkuSearch(e.target.value)} />
            </form>
            <div className="flex-1 bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 flex flex-col">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3 mb-6"><ShoppingCart className="w-6 h-6 text-indigo-600" /> Carrito Actual</h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                {cart.map(item => (
                  <div key={item.codigo} className="bg-slate-50 p-5 rounded-3xl flex items-center justify-between border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-sm transition-all group">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-base font-bold text-slate-800 truncate">{item.nombre}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="flex items-center gap-1 text-[12px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded border"><Tag className="w-3 h-3" /> {item.codigo}</span>
                        {item.talle && <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Talle: {item.talle}</span>}
                        {item.color && <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Color: {item.color}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center bg-white border border-slate-100 rounded-2xl p-1 gap-1">
                        <button onClick={() => updateQuantity(item.codigo, -1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Minus className="w-4 h-4" /></button>
                        <span className="w-10 text-center text-sm font-black text-slate-700">{item.cantidad}</span>
                        <button onClick={() => updateQuantity(item.codigo, 1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Plus className="w-4 h-4" /></button>
                      </div>
                      <div className="text-right min-w-[100px]"><p className="font-bold text-lg text-slate-900">${(item.precioUnitario * item.cantidad).toLocaleString()}</p></div>
                      <button onClick={() => setCart(prev => prev.filter(i => i.codigo !== item.codigo))} className="p-2.5 bg-white text-slate-300 hover:text-rose-600 rounded-xl transition-all border border-slate-100 shadow-sm"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8 h-full">
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-4 relative">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Cliente asociado</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder={isExchangeMode ? "Cliente bloqueado en modo cambio" : "Buscar cliente..."} 
                  disabled={isExchangeMode} 
                  className={`w-full pl-12 pr-4 py-4 border-none rounded-2xl focus:outline-none text-sm font-medium ${
                    isExchangeMode ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50 focus:ring-4 focus:ring-indigo-500/10'
                  }`} 
                  value={clientSearch} 
                  onChange={(e) => { 
                    setClientSearch(e.target.value); 
                    if (selectedClient) setSelectedClient(null); 
                  }} 
                />
                {clientesSugeridos.length > 0 && !selectedClient && (
                  <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-2xl shadow-2xl border border-slate-100 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {clientesSugeridos.map(c => (
                      <button key={c.id} type="button" onClick={() => { setSelectedClient(c); setClientSearch(`${c.nombre} ${c.apellido}`); setClientesSugeridos([]); }} className="w-full text-left px-6 py-4 hover:bg-indigo-50 transition-colors text-sm border-b border-slate-50 last:border-none">
                        <p className="font-bold text-slate-700">{c.nombre} {c.apellido}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">DNI: {c.dni} • {c.categoriaCliente}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedClient && (
                <div className={`p-5 rounded-3xl border-l-4 animate-in slide-in-from-right-2 flex justify-between items-center ${selectedClient.categoriaCliente === 'CONFIABLE' ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
                  <div><p className="text-lg font-bold text-slate-900 leading-none">{selectedClient.nombre} {selectedClient.apellido}</p><p className="text-[10px] font-black text-slate-500 mt-1.5 uppercase tracking-widest">{selectedClient.categoriaCliente}</p></div>
                  {!isExchangeMode && (
                    <button 
                      onClick={() => { setSelectedClient(null); setClientSearch(''); }} 
                      className="text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-5 h-5"/>
                    </button>
                  )}
                </div>
              )}
            </div>

<div className="bg-white p-8 rounded-[40px] border border-slate-200 flex flex-col justify-between flex-1 relative overflow-hidden h-full">
  <div className="space-y-4">
    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
      {isExchangeMode ? 'Diferencia a abonar' : 'Total de Operación'}
    </h4>
    <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
      ${totalFinal.toLocaleString()}
    </p>

    
    {isExchangeMode && selectedVenta && (
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-[14px] font-bold uppercase text-slate-400">
          <span>Subtotal:</span>
          <span>${subtotalCarrito.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[14px] font-bold uppercase text-rose-500">
          <span>Total pagado:</span>
          <span>-${selectedVenta.montoPagado.toLocaleString()}</span>
        </div>
      </div>
    )}
  </div>

  <div className="space-y-3 mt-8">
    <button 
      disabled={cart.length === 0} 
      onClick={handleConfirmarPedido} 
      className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
    >
      <CheckCircle2 className="w-6 h-6" /> 
      {isExchangeMode ? 'Confirmar Cambio' : 'Confirmar Pedido'}
    </button>
  </div>
</div>
          </div>
        </div>
      )}

      {/* DETALLE VENTA */}
      {view === 'DETAIL' && selectedVenta && (
        <div className="space-y-6 animate-in">
          <button onClick={() => setView('LIST')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold text-sm transition-colors"><ArrowLeft className="w-4 h-4" /> Volver al Historial</button>
          
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Detalle de operación</p>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ESTADOS_VENTA[selectedVenta.estadoNombre]?.color || 'bg-slate-100'}`}>
                  {ESTADOS_VENTA[selectedVenta.estadoNombre]?.label || selectedVenta.estadoNombre}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{selectedVenta.cliente?.nombre || 'Consumidor Final'} {selectedVenta.cliente?.apellido || ''}</h2>
              
              <div className="flex items-center gap-4 mt-2">
                <p className="text-sm font-medium text-slate-400 flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> {selectedVenta.id}</p>
                <p className="text-sm font-medium text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(selectedVenta.fecha).toLocaleDateString('es-AR')}</p>
                
                {/* MÉTODO DE PAGO*/}
                <p className="text-sm font-bold text-slate-500 flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-sm">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-500" /> 
                  {selectedVenta.metodoPago ? selectedVenta.metodoPago.replace('_', ' ') : 'Pendiente de cobro'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Monto total</p>
              <p className="text-4xl font-bold text-slate-900 tracking-tight leading-none">${selectedVenta.total.toLocaleString()}</p>
            </div>
          </div>

            <div className="flex border-b border-slate-100 px-10">
              <button onClick={() => setActiveTab('DETAILS')} className={`py-4 text-sm font-bold mr-8 border-b-2 transition-all ${activeTab === 'DETAILS' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent'}`}>Productos</button>
              <button onClick={() => setActiveTab('PAYMENTS')} className={`py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'PAYMENTS' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent'}`}>Pagos</button>
            </div>

            <div className="p-10">
              {activeTab === 'DETAILS' ? (
                <div className="space-y-4">
                  {selectedVenta.detalles?.map((d: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-6 bg-slate-50 rounded-[30px] border border-slate-100 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-500 border border-slate-100 shadow-sm"><Package className="w-7 h-7" /></div>
                        <div>
                          <p className="text-lg font-bold text-slate-800 leading-tight">{d.detalleProducto?.productoNombre || "Producto"}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded border"><Tag className="w-3 h-3" /> {d.detalleProducto?.codigo}</span>
                            {d.detalleProducto?.talleNombre && <span className="text-[11px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded border">Talle: {d.detalleProducto.talleNombre}</span>}
                            {d.detalleProducto?.colorNombre && <span className="text-[11px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded border">Color: {d.detalleProducto.colorNombre}</span>}
                            <span className="text-[11px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Cantidad: {d.cantidad}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right"><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Monto</p><span className="font-bold text-2xl text-slate-900">${(d.precioTotalUnitario || 0).toLocaleString()}</span></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {(!selectedVenta.pagosCredito || selectedVenta.pagosCredito.length === 0) ? <div className="text-center py-16 opacity-20"><History className="w-12 h-12 mx-auto mb-3" /><p className="font-bold text-sm uppercase tracking-widest">Sin pagos registrados</p></div> : selectedVenta.pagosCredito.map((p: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm"><History className="w-6 h-6" /></div><div><p className="text-lg font-bold text-slate-800">Pago #{i + 1}</p><p className="text-sm font-medium text-slate-400 mt-0.5">{new Date(p.fecha).toLocaleDateString('es-AR')}</p></div></div><span className="font-bold text-2xl text-emerald-600">${p.monto.toLocaleString()}</span></div>
                  ))}
                </div>
              )}
            </div>
<div className="p-10 bg-slate-50/80 border-t border-slate-100 flex flex-wrap justify-between items-center gap-6">
  <div className="flex gap-8">
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Abonado</p>
      <p className="text-xl font-bold text-slate-700">${selectedVenta.montoPagado.toLocaleString()}</p>
    </div>
    {selectedVenta.saldoPendiente > 0 && (
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pendiente</p>
        <p className="text-xl font-bold text-rose-500">${selectedVenta.saldoPendiente.toLocaleString()}</p>
      </div>
    )}
  </div>

  <div className="flex gap-3">
   
    {(selectedVenta.estadoNombre === 'VentaPagada' || selectedVenta.estadoNombre === 'VentaReservada') && (
      <button 
        onClick={handleStartExchange}
        className="flex items-center gap-2 px-6 py-3.5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl font-bold text-[11px] uppercase hover:bg-indigo-50 transition-all active:scale-95 shadow-sm"
      >
        <RefreshCw className="w-4 h-4" /> Procesar Cambio
      </button>
    )}

    
    {(selectedVenta.estadoNombre === 'VentaPagada' || selectedVenta.estadoNombre === 'VentaReservada') && (
      <button 
        onClick={() => handleAccionVenta('CANCELAR')}
        className="flex items-center gap-2 px-6 py-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl font-bold text-[11px] uppercase hover:bg-rose-100 transition-all active:scale-95"
      >
        <X className="w-4 h-4" /> Cancelar Venta
      </button>
    )}

    {selectedVenta.estadoNombre === 'VentaIniciada' && (
      <div className="flex gap-3">
        {/* Botón Cobrar Total */}
        <button 
          onClick={handlePagarDesdeDetalle}
          className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200"
        >
          <DollarSign className="w-4 h-4" /> Cobrar Total
        </button>


        <button 
          disabled={!selectedVenta.cliente}
          onClick={handleReservarDesdeDetalle}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-[11px] uppercase transition-all active:scale-95 border-2 ${
            selectedVenta.cliente 
              ? 'bg-white border-indigo-600 text-indigo-600 hover:bg-indigo-50 shadow-sm' 
              : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Reservar
        </button>

    
        <button 
          onClick={() => handleAccionVenta('RECHAZAR')}
          className="flex items-center gap-2 px-6 py-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl font-bold text-[11px] uppercase hover:bg-rose-100 transition-all active:scale-95"
        >
          <AlertCircle className="w-4 h-4" /> Rechazar
        </button>
      </div>
    )}
  </div>
</div>
          </div>
        </div>
      )}

      {/* MODAL POST-VENTA */}
      {showPostVentaModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">
                {lastCreatedVenta?.estadoNombre === 'VentaPagada' ? '¡Cambio Procesado!' : '¡Venta Iniciada!'}
              </h3>
              
              <p className="text-slate-500 font-medium">
                {lastCreatedVenta?.estadoNombre === 'VentaPagada' 
                  ? 'El cambio se ha registrado correctamente.' 
                  : '¿Cómo desea proceder con esta transacción?'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             
              <button 
                onClick={() => { setShowPagoModal(true); setShowPostVentaModal(false); }}
                className="group p-6 bg-slate-900 text-white rounded-3xl flex flex-col items-center gap-3 hover:bg-black transition-all active:scale-95"
              >
                <DollarSign className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-sm uppercase tracking-widest text-center">Cobrar</p>
              </button>

              <button 
                disabled={!lastCreatedVenta?.cliente}
                onClick={() => { setShowReservaModal(true); setShowPostVentaModal(false); }}
                className={`group p-6 rounded-3xl flex flex-col items-center gap-3 transition-all active:scale-95 border-2 ${lastCreatedVenta?.cliente ? 'bg-white border-indigo-600 text-indigo-600 hover:bg-indigo-50' : 'bg-slate-50 border-slate-100 text-slate-200 opacity-50 cursor-not-allowed'}`}
              >
                <CreditCard className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-sm uppercase tracking-widest text-center">Reservar</p>
              </button>
            </div>

            <button 
              onClick={() => { setShowPostVentaModal(false); setView('LIST'); fetchVentas(); }} 
              className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Finalizar y volver al historial
            </button>
          </div>
        </div>
      )}

      {/* MODAL RESERVA */}
{showReservaModal && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-200">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Configurar reserva</h3>
        <button onClick={() => { setShowReservaModal(false); setMontoReserva(''); }} className="text-slate-300 hover:text-rose-500 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Total pedido</p>
            <p className="text-2xl font-black text-slate-900">${lastCreatedVenta?.total.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-indigo-500 uppercase mb-1 tracking-widest">Pago Mínimo</p>
         
            <p className="text-lg font-bold text-indigo-600">
              ${lastCreatedVenta?.pagoMinimoParaCredito?.toLocaleString() || '0'}
            </p>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-200/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Cliente</p>
          <p className="text-sm font-bold text-slate-700">{lastCreatedVenta?.cliente?.nombre} {lastCreatedVenta?.cliente?.apellido}</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Monto de seña</label>
        <div className="relative">
          <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500 w-6 h-6" />
          <input 
            type="number" 
            autoFocus
            placeholder="0,00"
            className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] text-2xl font-black text-slate-900 outline-none focus:border-emerald-500 transition-all shadow-inner"
            value={montoReserva}
            onChange={(e) => setMontoReserva(e.target.value)}
          />
        </div>
        
        <div className="space-y-1 px-2">
          <p className="text-[11px] text-slate-500 font-medium italic">
            * El saldo restante 
            <span className="font-bold text-slate-700">
              {" "}${totalFinal.toLocaleString()}
            </span> se sumará a la deuda del cliente.
          </p>
          
         
          {montoReserva && parseFloat(montoReserva) < (lastCreatedVenta?.pagoMinimoParaCredito || 0) && (
            <p className="text-[10px] text-rose-500 font-bold uppercase flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> El monto es menor al pago mínimo requerido.
            </p>
          )}

         
          {montoReserva && parseFloat(montoReserva) > totalFinal && (
            <p className="text-[10px] text-rose-500 font-bold uppercase flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> El monto no puede superar el total de ${totalFinal.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-2">
        <button 
          onClick={() => { 
            setShowReservaModal(false); 
            if (!isComingFromDetail) setShowPostVentaModal(true); 
          }}
          className="flex-1 py-4 font-bold text-xs text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-colors"
        >
          {isComingFromDetail ? 'Cerrar' : 'Atrás'}
        </button>
        <button 
          disabled={
            !montoReserva || 
            parseFloat(montoReserva) < (lastCreatedVenta?.pagoMinimoParaCredito || 0) ||
            parseFloat(montoReserva) > totalFinal
          }
          onClick={handleConfirmarReserva}
          className="flex-[2] py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
        >
          Confirmar reserva
        </button>
      </div>
    </div>
  </div>
)}

      {/* MODAL PAGO */}
      {showPagoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Seleccionar pago</h3>
              <p className="text-slate-500 font-medium mt-1">
                Venta #{lastCreatedVenta?.id} • 
                <span className="text-indigo-600 font-bold ml-1">
                  ${totalFinal.toLocaleString()}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(METODOS_PAGO_MAP).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handlePagarVentaCompleta(key)}
                  className="p-6 bg-slate-50 border border-slate-100 rounded-[30px] font-bold text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all active:scale-95"
                >
                  <span className="block text-xs tracking-widest uppercase">{label}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={() => { 
                setShowPagoModal(false); 
                if (!isComingFromDetail) setShowPostVentaModal(true); 
              }}
              className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600"
            >
              {isComingFromDetail ? 'Cerrar' : 'Cancelar'}
            </button>
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
                <p className="text-slate-500 text-sm whitespace-pre-line leading-relaxed">{successMessage}</p>
              </div>
            </div>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-slate-900 text-white rounded-[20px] font-bold text-sm uppercase tracking-widest hover:bg-black active:scale-95 shadow-xl shadow-slate-200">Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;
