import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ShoppingBag, Users, AlertTriangle, Package, Loader2 } from 'lucide-react';
import VentaService from '../services/ventaService.js';
import ProductoService from '../services/productoService.js';
import ClienteService from '../services/clienteService.js';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    ventasMes: 0,
    reservasActivas: 0,
    clientesTotales: 0,
    productosCriticos: [] as any[],
    totalCriticos: 0
  });
  
  const [chartData, setChartData] = useState([] as any[]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Ejecutamos todo en paralelo
      const [
        respCriticos, 
        respReservas, 
        totalIngresos, 
        respClientes, 
        respGrafico
      ] = await Promise.all([
        ProductoService.getProductos({ stockBajo: true, pagina: 0 }),
        VentaService.getVentas({ estado: 'VentaReservada', pagina: 0 }),
        VentaService.ventasMes(),
        ClienteService.getClientes({ pagina: 0 }),
        VentaService.ventasSemana()
      ]);

      const variantesCriticas = respCriticos.content.flatMap((p: any) => 
        (p.detalles || []).filter((d: any) => d.stockDisponible <= d.stockMinimo)
        .map((d: any) => ({
          ...d,
          nombreProducto: p.nombre 
        }))
      );

      setStats({
        ventasMes: totalIngresos,
        reservasActivas: respReservas.totalElements,
        clientesTotales: respClientes.totalElements,
        productosCriticos: variantesCriticas,
        totalCriticos: respCriticos.totalElements
      });

      const dataMapeada = respGrafico.map((item: any) => ({
        name: new Date(item.dia + "T00:00:00").toLocaleDateString('es-AR', { 
          day: '2-digit', 
          month: 'short' 
        }),
        ventas: item.total
      }));

      setChartData(dataMapeada);
    } catch (error) {
      console.error("Error en Dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDashboardData();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [fetchDashboardData]);

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {loading ? (
        /* SPINNER */
        <div className="p-40 text-center flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
          <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs tracking-[0.2em]">
            Cargando dashboard...
          </p>
        </div>
      ) : (
      
        <div className="space-y-8">
          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Ingresos confirmados" 
              value={`$${stats.ventasMes.toLocaleString()}`} 
              icon={TrendingUp} 
              color="bg-emerald-500" 
              description="Ventas con estado PAGADA"
            />
            <StatCard 
              title="Reservas activas" 
              value={stats.reservasActivas.toString()} 
              icon={ShoppingBag} 
              color="bg-indigo-500" 
              description="Pendientes de retiro/pago"
            />
            <StatCard 
              title="Clientes confiables" 
              value={stats.clientesTotales > 0 ? stats.clientesTotales.toString() : "--"} 
              icon={Users} 
              color="bg-amber-500" 
              description="Total registrados"
            />
            <StatCard 
              title="Alertas de stock" 
              value={stats.totalCriticos.toString()} 
              icon={AlertTriangle} 
              color="bg-rose-500" 
              description="Bajo stock mínimo"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* GRÁFICO */}
            <div className="lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                  Flujo de ventas
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">Último mes</span>
              </div>
              <div className="h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px'}} 
                    />
                    <Area type="monotone" dataKey="ventas" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorVentas)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* LISTADO DE ALERTAS */}
            <div className="lg:col-span-4 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                  Stock Crítico
                </h3>
                {stats.totalCriticos > 0 && (
                  <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-3 py-1 rounded-full border border-rose-100 uppercase animate-pulse">
                    {stats.totalCriticos} items
                  </span>
                )}
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[420px] custom-scrollbar">
                {stats.productosCriticos.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[30px] mx-auto flex items-center justify-center mb-6">
                      <Package className="w-10 h-10" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Inventario Saludable</p>
                  </div>
                ) : (
                  stats.productosCriticos.map((item) => (
                    <div key={item.id} className="p-6 bg-slate-50 rounded-[32px] border border-transparent hover:border-indigo-100 transition-all group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                            <Package className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight text-base mb-1">
                              {item.nombreProducto}
                            </p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
                              {item.codigo} • {item.talle?.descripcion || "Sin talle"} / {item.color?.descripcion || "Sin color"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-rose-600 font-black text-m leading-none mb-1">
                            {item.stockDisponible}
                          </p>
                          <p className="text-[12px] text-slate-400 font-bold uppercase">Stock</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button 
                onClick={() => navigate('/productos')}
                className="w-full mt-8 py-6 bg-slate-900 text-white rounded-[28px] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-95"
              >
                Ver Inventario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; icon: any; color: string; description: string }> = ({ title, value, icon: Icon, color, description }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 hover:border-indigo-300 transition-all cursor-default">
    <div className={`${color} p-3 rounded-xl text-white shadow-lg shadow-slate-100`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
    </div>
  </div>
);

export default Dashboard;
