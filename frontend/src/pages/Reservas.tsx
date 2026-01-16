import React, { useState, useEffect } from 'react';
import { 
  DollarSign, XCircle, Eye, ArrowLeft, History, Package, 
  Calendar, Hash, Loader2, AlertCircle, Tag, 
  X
} from 'lucide-react';
import VentaService from '../services/ventaService.js';
import ProductoService from '../services/productoService.js';

const Reservas: React.FC = () => {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReserva, setSelectedReserva] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'PAYMENTS'>('DETAILS');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [montoAbono, setMontoAbono] = useState('');

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservaParaCancelar, setReservaParaCancelar] = useState<any | null>(null);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      const data = await VentaService.getVentas({ estado: 'VentaReservada' });
      const lista = data.content ? data.content : data;
      setReservas(Array.isArray(lista) ? lista : []);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      cargarReservas();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, []);

  const formatFecha = (fechaStr: string) => {
    if (!fechaStr) return 'N/A';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const estaVencida = (fechaStr: string) => {
    if (!fechaStr) return false;
    return new Date(fechaStr) < new Date();
  };

  // Usamos los nombres exactos del VentaResponse DTO
  const getMontoPagado = (r: any) => r.montoPagado ?? 0;
  const getTotal = (r: any) => r.total ?? 0;
  const saldoPendiente = selectedReserva ? (getTotal(selectedReserva) - getMontoPagado(selectedReserva)) : 0;

  const handleConfirmPayment = async () => {
    if (!selectedReserva || !montoAbono) return;

    if (parseFloat(montoAbono) > saldoPendiente) {
      console.error(`El monto no puede superar el saldo pendiente ($${saldoPendiente})`);
      return;
    }

    try {
      await VentaService.agregarPagoReserva(selectedReserva.id, { monto: parseFloat(montoAbono) });
      setMontoAbono('');
      setShowPaymentModal(false);

      const actualizada = await VentaService.getVentaById(selectedReserva.id);
      setSelectedReserva(actualizada);
      cargarReservas();
    } catch (error) { 
      console.error("Error al registrar el pago"); 
    }
  };

  const abrirModalCancelacion = (reserva: any) => {
    setReservaParaCancelar(reserva);
    setShowCancelModal(true);
  };

  const ejecutarCancelacion = async () => {
    if (!reservaParaCancelar) return;
    try {
      await VentaService.cancelarVenta(reservaParaCancelar.id, { motivo: "Cancelado por usuario" });
      setShowCancelModal(false);
      setReservaParaCancelar(null);
      setSelectedReserva(null);
      cargarReservas();
    } catch (error) { 
      console.log("Error al cancelar"); 
    }
  };

  return (
    <div className="space-y-8 animate-in">
      {/* El título siempre visible */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Reservas</h2>
        <p className="text-slate-500 font-medium mt-1">Control de pagos parciales y estados de crédito</p>
      </div>

      {!selectedReserva ? (
        <>
          {loading ? (
            /* ESTADO CARGANDO: Replicado de Productos */
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-20 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando reservas...</p>
            </div>
          ) : (
            /* LISTADO DE TARJETAS */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reservas.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold uppercase tracking-widest">No hay reservas activas</p>
                </div>
              ) : (
                reservas.map(reserva => {
                  const paid = getMontoPagado(reserva);
                  const total = getTotal(reserva);
                  const progress = reserva.progresoPago || 0;
                  const vencida = estaVencida(reserva.fechaVencimientoReserva);
                  const barColor = vencida ? 'bg-rose-500' : (progress > 80 ? 'bg-emerald-500' : 'bg-indigo-600');
                  
                  return (
                    <div key={reserva.id} className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 flex flex-col group hover:border-indigo-300 hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-white font-bold text-2xl ${vencida ? 'bg-rose-600' : 'bg-indigo-600'}`}>{(reserva.cliente?.nombre || 'C').charAt(0)}</div>
                        <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-3 py-1 rounded-lg border ${vencida ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                          {vencida ? <AlertCircle className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />} Vence: {formatFecha(reserva.fechaVencimientoReserva)}
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-8">{reserva.cliente?.nombre || `Reserva #${reserva.id}`}</h4>
                      <div className="bg-slate-50 p-6 rounded-[24px] space-y-3 border border-slate-100">
                        <div className="flex justify-between text-[10px] font-black uppercase"><p>{vencida ? 'Expirada' : 'Progreso de Pago'}</p><p>{Math.round(progress)}%</p></div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden"><div className={`${barColor} h-full transition-all`} style={{ width: `${progress}%` }}></div></div>
                        <div className="flex justify-between pt-2">
                          <div className="text-left"><p className="text-[10px] font-bold text-slate-400 uppercase">Total</p><p className="text-lg font-medium text-slate-700">${total.toLocaleString()}</p></div>
                          <div className="text-right"><p className="text-[10px] font-bold text-slate-400 uppercase">Pendiente</p><p className="text-2xl font-black text-rose-600">${(total - paid).toLocaleString()}</p></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-10">
                        <button onClick={() => setSelectedReserva(reserva)} className="py-4 bg-white border border-slate-200 rounded-[20px] text-[11px] font-bold uppercase text-slate-600 hover:border-indigo-600 transition-all"><Eye className="w-4 h-4 inline mr-1"/> Detalle</button>
                        <button onClick={() => abrirModalCancelacion(reserva)} className="py-4 bg-rose-50 text-rose-600 rounded-[20px] text-[11px] font-bold uppercase border border-rose-100 hover:bg-rose-100 transition-all active:scale-95"><XCircle className="w-4 h-4 inline mr-1"/> Cancelar</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      ) : (
        /* --- FICHA DE DETALLE --- */
        <div className="space-y-6 animate-in">
          <button onClick={() => setSelectedReserva(null)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver al listado
          </button>
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Ficha de Reserva</p>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {selectedReserva.cliente?.nombre 
                    ? `${selectedReserva.cliente.nombre} ${selectedReserva.cliente.apellido || ''}`
                    : `Cliente #${selectedReserva.id}`}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm font-medium text-slate-400 flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> {selectedReserva.id}</span>
                  <span className={`text-sm font-bold flex items-center gap-1.5 ${estaVencida(selectedReserva.fechaVencimientoReserva) ? 'text-rose-600' : 'text-slate-500'}`}>
                    <Calendar className="w-3.5 h-3.5" /> Vence: {formatFecha(selectedReserva.fechaVencimientoReserva)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Saldo Pendiente</p>
                <p className="text-4xl font-bold text-rose-600 tracking-tight leading-none">${saldoPendiente.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex border-b border-slate-100 px-10">
              <button onClick={() => setActiveTab('DETAILS')} className={`py-4 text-sm font-bold mr-8 border-b-2 ${activeTab === 'DETAILS' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent'}`}>Productos</button>
              <button onClick={() => setActiveTab('PAYMENTS')} className={`py-4 text-sm font-bold border-b-2 ${activeTab === 'PAYMENTS' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent'}`}>Historial de Pagos</button>
            </div>

            <div className="p-10">
              {activeTab === 'DETAILS' ? (
                <div className="space-y-4">
                  {selectedReserva.detalles?.map((d: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-500 border border-slate-100 shadow-sm"><Package className="w-6 h-6" /></div>
                        <div>
                          <p className="text-lg font-bold text-slate-800 leading-tight">{d.detalleProducto?.productoNombre || "Producto"}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded border"><Tag className="w-3 h-3" /> Código: {d.detalleProducto?.codigo || "S/C"}</span>
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Cantidad: {d.cantidad || 0}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Precio unitario: ${d.precioUnitarioActual.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Monto</p>
                        <span className="font-bold text-2xl text-slate-900">${(d.precioTotalUnitario || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedReserva.pagosCredito?.map((p: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm"><History className="w-6 h-6" /></div>
                        <div><p className="text-lg font-bold text-slate-800 leading-tight">Pago #{p.numeroPago || i+1}</p><p className="text-sm font-medium text-slate-400 mt-0.5">{formatFecha(p.fecha)}</p></div>
                      </div>
                      <span className="font-bold text-2xl text-emerald-600">${(p.monto).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-10 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center">
              <div className="flex gap-8">
                <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Reserva</p><p className="text-xl font-bold text-slate-700">${getTotal(selectedReserva).toLocaleString()}</p></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Abonado</p><p className="text-xl font-bold text-emerald-600">${getMontoPagado(selectedReserva).toLocaleString()}</p></div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowPaymentModal(true)} className="px-8 py-4 bg-indigo-600 text-white rounded-[24px] font-bold text-sm uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all"><DollarSign className="w-5 h-5 inline mr-2"/>Registrar abono</button>
                <button onClick={() => abrirModalCancelacion(selectedReserva)} className="px-8 py-4 bg-white text-rose-500 rounded-[24px] font-bold text-sm uppercase border border-slate-200 hover:bg-rose-50 transition-all"><XCircle className="w-5 h-5 inline mr-2"/>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODALES --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Registrar Abono</h3>
              <button onClick={() => { setShowPaymentModal(false); setMontoAbono(''); }} className="text-slate-300 hover:text-rose-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Saldo Pendiente</p>
                  <p className="text-2xl font-black text-slate-900">${(selectedReserva?.saldoPendiente || 0).toLocaleString()}</p>
                </div>
                <div className="text-right text-indigo-600"><Tag className="w-6 h-6 ml-auto opacity-20" /></div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Monto a entregar</label>
                <div className="relative">
                  <DollarSign className={`absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors ${montoAbono && parseFloat(montoAbono) > selectedReserva?.saldoPendiente ? 'text-rose-500' : 'text-emerald-500'}`} />
                  <input type="number" autoFocus placeholder="0,00" className={`w-full pl-14 pr-6 py-5 bg-white border-2 rounded-[24px] text-2xl font-black outline-none transition-all shadow-inner ${montoAbono && parseFloat(montoAbono) > selectedReserva?.saldoPendiente ? 'border-rose-500 text-rose-600' : 'border-slate-100 text-slate-900 focus:border-emerald-500'}`} value={montoAbono} onChange={(e) => setMontoAbono(e.target.value)} />
                </div>
                {montoAbono && parseFloat(montoAbono) > selectedReserva?.saldoPendiente && (
                  <div className="px-2 animate-in fade-in slide-in-from-top-1"><p className="text-[10px] text-rose-500 font-bold uppercase flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> El monto no puede superar el saldo pendiente</p></div>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setShowPaymentModal(false); setMontoAbono(''); }} className="flex-1 py-4 font-bold text-xs text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl">Cancelar</button>
              <button disabled={!montoAbono || parseFloat(montoAbono) <= 0 || parseFloat(montoAbono) > selectedReserva?.saldoPendiente} onClick={handleConfirmPayment} className="flex-[2] py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed">Confirmar Abono</button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 space-y-8 animate-in zoom-in duration-200">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-[30px] mx-auto flex items-center justify-center"><XCircle className="w-10 h-10" /></div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-slate-900 tracking-tight uppercase">¿Anular Reserva?</h4>
                <p className="text-slate-500 text-sm">Estás por cancelar la reserva de <span className="font-bold text-slate-700">{reservaParaCancelar?.cliente?.nombre || `Reserva #${reservaParaCancelar?.id}`}</span>.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setShowCancelModal(false); setReservaParaCancelar(null); }} className="flex-1 py-4 font-bold text-sm text-slate-400 uppercase tracking-widest">Volver</button>
              <button onClick={ejecutarCancelacion} className="flex-[2] py-4 bg-rose-600 text-white rounded-[20px] font-bold text-sm uppercase shadow-xl shadow-rose-100 transition-all">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservas;