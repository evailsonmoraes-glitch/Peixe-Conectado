import React from 'react';
import { motion } from 'motion/react';
import { Wifi, Mic, Map as MapIcon, Settings, CloudSun, Newspaper, PhoneCall } from 'lucide-react';

interface HomeTabProps {
  setActiveTab: (tab: any) => void;
}

export default function HomeTab({ setActiveTab }: HomeTabProps) {
  const menuItems = [
    { id: 'clima', title: 'Clima e Maré', icon: <CloudSun size={32} />, color: 'bg-orange-500 hover:bg-orange-600', subtitle: 'Tempo, vento e lua' },
    { id: 'noticias', title: 'Notícias MAPA', icon: <Newspaper size={32} />, color: 'bg-indigo-600 hover:bg-indigo-700', subtitle: 'Sobre aquicultura' },
    { id: 'mapa', title: 'Mapa de Pesca', icon: <MapIcon size={32} />, color: 'bg-emerald-500 hover:bg-emerald-600', subtitle: 'Pontos sustentáveis' },
    { id: 'historias', title: 'Histórias Orais', icon: <Mic size={32} />, color: 'bg-purple-500 hover:bg-purple-600', subtitle: 'Acervo cultural' },
    { id: 'internet', title: 'Sinal de Internet', icon: <Wifi size={32} />, color: 'bg-blue-500 hover:bg-blue-600', subtitle: 'Teste de conexão' },
    { id: 'emergencia', title: 'Emergência', icon: <PhoneCall size={32} />, color: 'bg-red-600 hover:bg-red-700', subtitle: 'Bombeiros, SAMU...' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
         <h2 className="text-xl font-bold text-slate-800 mb-2">Bem-vindo ao Peixe Conectado!</h2>
         <p className="text-slate-500 text-sm">Selecione uma ferramenta abaixo para começar.</p>
       </div>

       <div className="grid grid-cols-2 gap-4">
         {menuItems.map(item => (
           <button
             key={item.id}
             onClick={() => setActiveTab(item.id)}
             className={`${item.color} text-white p-5 rounded-2xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center justify-center text-center gap-3`}
           >
             <div className="bg-white/20 p-3 rounded-full">
               {item.icon}
             </div>
             <div>
                 <h3 className="font-bold text-sm tracking-wide">{item.title}</h3>
                 <p className="text-[10px] sm:text-xs text-white/90 mt-1">{item.subtitle}</p>
             </div>
           </button>
         ))}
       </div>
    </motion.div>
  );
}
