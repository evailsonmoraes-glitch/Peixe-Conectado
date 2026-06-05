import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cloud, Droplets, Wind, Moon, Thermometer, Waves, CloudSun } from 'lucide-react';

export default function ClimaTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/clima')
      .then(res => {
         if (!res.ok) throw new Error("Network error");
         return res.json();
      })
      .then(json => {
         setData(json);
         setLoading(false);
      })
      .catch((err) => {
         console.error(err);
         setError(true);
         setLoading(false);
      });
  }, []);

  if (loading) {
    return (
       <div className="flex flex-col items-center justify-center p-12 text-slate-500 gap-4">
         <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
         <p>Buscando dados climáticos em tempo real...</p>
       </div>
    );
  }

  if (error || !data) {
    return (
       <div className="p-6 text-center text-red-600 bg-red-50 rounded-2xl">
         <p>Não foi possível carregar as informações do clima no momento. Tente novamente mais tarde.</p>
       </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 text-orange-600">
        <CloudSun size={24} /> Clima, Tempo e Maré
      </h2>

      <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-2xl shadow-md text-white">
        <div className="flex justify-between items-center">
            <div>
                <h3 className="text-lg font-medium opacity-90">Hoje, {data.location}</h3>
                <div className="flex items-center gap-2 mt-2">
                    <Thermometer size={32} />
                    <span className="text-4xl font-bold">{data.temperature}</span>
                </div>
                <p className="text-blue-100 mt-1 capitalize">{data.condition}</p>
            </div>
            <Cloud size={64} className="opacity-80" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-blue-300/40">
           <div className="flex items-center gap-2">
              <Droplets className="opacity-70" />
              <div>
                  <p className="text-xs text-blue-100">Umidade</p>
                  <p className="font-bold">{data.humidity}</p>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <Wind className="opacity-70" />
              <div>
                  <p className="text-xs text-blue-100">Vento</p>
                  <p className="font-bold">{data.wind}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
             <div className="w-12 h-12 rounded-full bg-slate-800 text-yellow-300 flex items-center justify-center mb-3">
                 <Moon size={24} />
             </div>
             <h3 className="font-semibold text-slate-700">Fase da Lua</h3>
             <p className="text-lg font-bold text-slate-900 mt-1">{data.moonPhase}</p>
             <p className="text-xs text-slate-500 mt-2">{data.moonStatus}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
             <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mb-3">
                 <Waves size={24} />
             </div>
             <h3 className="font-semibold text-slate-700">Tábua de Maré</h3>
             <div className="mt-2 text-sm w-full space-y-1">
                 <div className="flex justify-between border-b border-slate-50 pb-1 mb-1">
                    <span className="text-slate-500">Baixa</span>
                    <span className="font-bold text-blue-600">{data.tideLow}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-500">Alta</span>
                    <span className="font-bold text-blue-600">{data.tideHigh}</span>
                 </div>
             </div>
          </div>
      </div>
    </motion.div>
  );
}
