import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { InternetTest } from '../types';

export default function InternetTab() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<InternetTest | null>(null);
  const [history, setHistory] = useState<InternetTest[]>(() => {
    const saved = localStorage.getItem('pc_internet_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleTest = () => {
    setIsTesting(true);
    setTestResults(null);
    
    // Simulate a network test
    setTimeout(() => {
      const ping = Math.floor(Math.random() * 200) + 20;
      const download = (Math.random() * 15 + 1).toFixed(1);
      const upload = (Math.random() * 5 + 0.5).toFixed(1);
      
      let quality = 'Boa';
      if (ping > 150 || parseFloat(download) < 2) quality = 'Ruim';
      else if (ping > 80 || parseFloat(download) < 5) quality = 'Razoável';
      
      const result: InternetTest = {
        id: Date.now().toString(),
        ping: `${ping} ms`,
        download: `${download} Mbps`,
        upload: `${upload} Mbps`,
        quality,
        date: new Date().toLocaleString()
      };
      
      setTestResults(result);
      const newHistory = [result, ...history].slice(0, 10); // Keep last 10
      setHistory(newHistory);
      localStorage.setItem('pc_internet_history', JSON.stringify(newHistory));
      setIsTesting(false);
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 text-blue-900">
        <span>📶</span> Qualidade da Internet
      </h2>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-700 mb-3">Status Atual</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-medium">{isOnline ? 'Online - Conectado' : 'Offline - Sem conexão'}</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-700 mb-4">Testar Conexão</h3>
        <button 
          onClick={handleTest}
          disabled={!isOnline || isTesting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors focus:ring-4 focus:ring-blue-100"
        >
          {isTesting ? '🔄 Testando...' : '🔄 Testar Qualidade'}
        </button>

        {testResults && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Velocidade de Download:</span>
              <span className="font-bold text-slate-800">{testResults.download}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Velocidade de Upload:</span>
              <span className="font-bold text-slate-800">{testResults.upload}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Ping (Latência):</span>
              <span className="font-bold text-slate-800">{testResults.ping}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 mt-2">
              <span className="text-slate-700 font-medium">Qualidade:</span>
              <span className={`font-bold ${testResults.quality === 'Ruim' ? 'text-red-600' : testResults.quality === 'Boa' ? 'text-green-600' : 'text-yellow-600'}`}>
                {testResults.quality}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
         <h3 className="font-semibold text-slate-700 mb-4">Histórico de Monitoramento</h3>
         {history.length === 0 ? (
           <p className="text-slate-500 text-sm text-center py-4">Nenhum teste realizado ainda.</p>
         ) : (
           <div className="space-y-3">
             {history.map(item => (
               <div key={item.id} className="text-sm border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                 <div className="flex justify-between font-medium mb-1.5">
                   <span className="text-slate-600">{item.date}</span>
                   <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.quality === 'Ruim' ? 'bg-red-50 text-red-600' : item.quality === 'Boa' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{item.quality}</span>
                 </div>
                 <div className="text-slate-500 flex justify-between font-mono text-xs bg-slate-50 p-2 rounded">
                   <span>↓ {item.download}</span>
                   <span>↑ {item.upload}</span>
                   <span>⏱ {item.ping}</span>
                 </div>
               </div>
             ))}
           </div>
         )}
      </div>
    </motion.div>
  );
}
