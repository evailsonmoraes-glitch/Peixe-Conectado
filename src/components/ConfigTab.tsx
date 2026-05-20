import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

export default function ConfigTab() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pc_profile');
    return saved ? JSON.parse(saved) : { name: '', community: '', role: 'pescador' };
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pc_profile', JSON.stringify(profile));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleClearData = () => {
    if (window.confirm("Atenção! Isso apagará permanentemente todas as suas histórias, pontos de pesca e histórico de internet deste dispositivo. Deseja continuar?")) {
        localStorage.removeItem('pc_profile');
        localStorage.removeItem('pc_fishing_spots');
        localStorage.removeItem('pc_stories');
        localStorage.removeItem('pc_internet_history');
        alert("Todos os dados foram excluídos com sucesso. O aplicativo será reiniciado.");
        window.location.reload();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 text-blue-900">
        <span>⚙️</span> Configurações
      </h2>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
            <h3 className="font-semibold text-slate-800">Perfil do Usuário</h3>
            {isSaved && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">Salvo!</span>}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
            <input required type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Seu nome completo" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Comunidade *</label>
            <input required type="text" value={profile.community} onChange={e => setProfile({...profile, community: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Nome da sua comunidade" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Função</label>
            <select value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                <option value="pescador">Pescador(a)</option>
                <option value="associacao">Associação de Pescadores</option>
                <option value="comunidade">Morador(a) da Comunidade</option>
                <option value="outro">Outro</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm focus:ring-4 focus:ring-blue-200 mt-2">
            💾 Salvar Perfil
          </button>
        </form>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
         <h3 className="font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">Gerenciamento de Dados</h3>
         <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
            <p className="text-sm text-blue-800">
                <strong>Modo Offline Ativo:</strong> Seus dados são salvos automaticamente na memória deste dispositivo para garantir o acesso sem internet.
            </p>
         </div>
         
         <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors mb-3 flex justify-center gap-2 items-center">
            <span>🔄</span> Sincronizar p/ Nuvem (Em breve)
         </button>
         
         <button onClick={handleClearData} className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-lg transition-colors border border-red-200 flex justify-center gap-2 items-center">
            <span>🗑️</span> Limpar Dados Locais
         </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
         <h3 className="font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">Sobre o App</h3>
         <div className="text-sm text-slate-600 space-y-3">
            <div className="flex items-center gap-3">
                <span className="text-3xl">🐟</span>
                <div>
                   <p className="font-bold text-slate-800">Peixe Conectado <span className="font-normal text-slate-500 ml-1 bg-slate-100 px-1.5 py-0.5 rounded text-xs">v1.0.0</span></p>
                   <p className="text-xs">Monitoramento Comunitário</p>
                </div>
            </div>
            
            <p className="mt-2">Desenvolvido como ferramenta de apoio tecnológico para comunidades pesqueiras.</p>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2 mb-2">
                <span className="font-semibold text-slate-700 mb-1 block">Módulos:</span>
                <ul className="space-y-1.5">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Qualidade de Internet</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Acervo de Histórias Orais</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Mapeamento Sustentável</li>
                </ul>
            </div>
            
            <p className="pt-2 text-xs text-slate-400 text-center uppercase tracking-widest font-semibold">© 2026 - Conexão Rio</p>
         </div>
      </div>
    </motion.div>
  );
}
