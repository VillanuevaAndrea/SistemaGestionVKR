import { useState, useEffect } from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';

const GlobalErrorModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [errorData, setErrorData] = useState({ mensaje: '', status: '' });

  useEffect(() => {
    const handleEvent = (event: any) => {
      setErrorData(event.detail);
      setIsOpen(true);
    };

    window.addEventListener("api-error-alert", handleEvent);
    return () => window.removeEventListener("api-error-alert", handleEvent);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl p-10 space-y-6 animate-in zoom-in duration-300 border-t-8 border-rose-500">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[30px] mx-auto flex items-center justify-center">
            <XCircle className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl font-bold text-slate-900 tracking-tight">Error {errorData.status}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{errorData.mensaje}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="w-full py-4 bg-rose-600 text-white rounded-[20px] font-bold text-sm uppercase tracking-widest hover:bg-rose-700 active:scale-95 transition-all shadow-xl shadow-rose-100"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default GlobalErrorModal;