/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Home, Map as MapIcon, Settings, CloudSun } from 'lucide-react';
import InternetTab from './components/InternetTab';
import StoriesTab from './components/StoriesTab';
import MapTab from './components/MapTab';
import ConfigTab from './components/ConfigTab';
import HomeTab from './components/HomeTab';
import ClimaTab from './components/ClimaTab';
import NoticiasTab from './components/NoticiasTab';
import EmergenciaTab from './components/EmergenciaTab';

type Tab = 'home' | 'internet' | 'historias' | 'mapa' | 'config' | 'clima' | 'noticias' | 'emergencia';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10 flex flex-col items-center sm:items-start max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>🐟</span> Peixe Conectado
        </h1>
        <p className="text-blue-100 text-sm mt-1">Monitoramento para Comunidades Pesqueiras</p>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto p-4 mb-24 overflow-x-hidden">
        {activeTab === 'home' && <HomeTab setActiveTab={setActiveTab} />}
        {activeTab === 'internet' && <InternetTab />}
        {activeTab === 'historias' && <StoriesTab />}
        {activeTab === 'mapa' && <MapTab />}
        {activeTab === 'config' && <ConfigTab />}
        {activeTab === 'clima' && <ClimaTab />}
        {activeTab === 'noticias' && <NoticiasTab />}
        {activeTab === 'emergencia' && <EmergenciaTab />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around w-full max-w-2xl mx-auto">
            <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={24} />} label="Início" />
            <NavButton active={activeTab === 'mapa'} onClick={() => setActiveTab('mapa')} icon={<MapIcon size={24} />} label="Mapa" />
            <NavButton active={activeTab === 'clima'} onClick={() => setActiveTab('clima')} icon={<CloudSun size={24} />} label="Clima" />
            <NavButton active={activeTab === 'config'} onClick={() => setActiveTab('config')} icon={<Settings size={24} />} label="Config" />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 min-w-[70px] transition-colors rounded-xl ${active ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
    >
      <div className={`mb-1 transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className={`text-[10px] sm:text-xs tracking-wide ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </button>
  );
}
