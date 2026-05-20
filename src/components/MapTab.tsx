import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FishingSpot } from '../types';

export default function MapTab() {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [spots, setSpots] = useState<FishingSpot[]>(() => {
    const saved = localStorage.getItem('pc_fishing_spots');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    season: '',
    sustainable: '',
    notes: ''
  });

  const getLocation = () => {
    setIsGettingLocation(true);
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada pelo seu navegador.");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsGettingLocation(false);
      },
      (error) => {
        alert("Erro ao obter localização. Verifique as permissões de localização do seu navegador.");
        setIsGettingLocation(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
        alert("Por favor, obtenha a localização primeiro.");
        return;
    }

    const newSpot: FishingSpot = {
      id: Date.now().toString(),
      ...formData,
      lat: location.lat,
      lng: location.lng,
      date: new Date().toLocaleDateString()
    };

    const updated = [newSpot, ...spots];
    setSpots(updated);
    localStorage.setItem('pc_fishing_spots', JSON.stringify(updated));

    setFormData({ name: '', species: '', season: '', sustainable: '', notes: '' });
    setLocation(null);
    alert('Ponto de pesca salvo com sucesso!');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 text-blue-900">
        <span>🗺️</span> Pontos de Pesca
      </h2>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-700 mb-4">Adicionar Novo Ponto</h3>
        
        <button 
          onClick={getLocation} 
          disabled={isGettingLocation}
          className="w-full mb-4 bg-slate-800 hover:bg-slate-900 focus:ring-4 focus:ring-slate-200 text-white font-medium py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-all disabled:opacity-70 shadow-sm"
        >
          {isGettingLocation ? '📍 Buscando Localização...' : '📍 Obter Minha Localização GPS'}
        </button>

        {location && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-5 p-3 bg-blue-50 border border-blue-100 text-blue-800 rounded-lg text-sm flex flex-col gap-1 items-center font-mono">
            <span className="font-semibold text-xs tracking-wider uppercase text-blue-600">Coordenadas Capturadas</span>
            <div className="flex gap-4">
                <span>Lat: {location.lat.toFixed(5)}</span>
                <span>Lng: {location.lng.toFixed(5)}</span>
            </div>
          </motion.div>
        )}

        {location && (
            <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Ponto *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: Barreiro do Tambaqui" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Espécies de Peixes *</label>
                <input required type="text" value={formData.species} onChange={e => setFormData({...formData, species: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: Tambaqui, Surubim, Pacu" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Melhor Época</label>
                <select value={formData.season} onChange={e => setFormData({...formData, season: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                    <option value="">Selecione...</option>
                    <option value="cheia">Águas altas (cheia)</option>
                    <option value="vazante">Águas baixas (vazante)</option>
                    <option value="todo">Todo o ano</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">É sustentável?</label>
                <select required value={formData.sustainable} onChange={e => setFormData({...formData, sustainable: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                    <option value="">Selecione...</option>
                    <option value="sim">Sim - Respeita o defeso</option>
                    <option value="parcial">Parcialmente</option>
                    <option value="nao">Não</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={2} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Profundidade, acesso, dicas..."></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm focus:ring-4 focus:ring-blue-200 mt-2">
                💾 Salvar Ponto de Pesca
            </button>
            </motion.form>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[200px] border-dashed border-2 m-1">
          <div className="text-5xl mb-4 bg-slate-50 p-4 rounded-full border border-slate-100">🗺️</div>
          <p className="text-slate-800 font-medium text-lg">{spots.length} pontos mapeados</p>
          <p className="text-sm text-slate-500 max-w-xs text-center mt-2 leading-relaxed">O mapa visual está sendo estabilizado para acesso offline nesta região.</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
         <div className="flex justify-between items-center mb-4">
             <h3 className="font-semibold text-slate-700">Pontos Cadastrados</h3>
             <button className="text-sm font-medium text-blue-600 hover:text-blue-800">📤 Exportar Mapa</button>
         </div>
         
         {spots.length === 0 ? (
             <p className="text-slate-500 text-sm text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">Nenhum ponto registrado.</p>
         ) : (
             <div className="space-y-4">
                 {spots.map(spot => (
                     <div key={spot.id} className="border border-slate-200 p-4 rounded-xl bg-white shadow-sm relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                         <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-slate-800">{spot.name}</h4>
                             <div className="flex gap-1 ml-2">
                                {spot.sustainable === 'sim' && <span className="text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-800 px-2.5 py-1 rounded-full border border-green-200">Sustentável</span>}
                                {spot.sustainable === 'parcial' && <span className="text-[10px] uppercase tracking-wider font-bold bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full border border-yellow-200">Alerta</span>}
                                {spot.sustainable === 'nao' && <span className="text-[10px] uppercase tracking-wider font-bold bg-red-100 text-red-800 px-2.5 py-1 rounded-full border border-red-200">Risco</span>}
                             </div>
                         </div>
                         <p className="text-sm text-slate-700 mb-1.5 font-medium">🐟 {spot.species}</p>
                         <p className="text-xs text-slate-500 mb-3">{spot.season === 'cheia' ? '🌊 Águas Altas' : spot.season === 'vazante' ? '📉 Águas Baixas' : '📅 O ano todo'}</p>
                         
                         {spot.notes && <p className="text-sm text-slate-600 mb-3 italic bg-slate-50 p-2 rounded border border-slate-100">"{spot.notes}"</p>}
                         
                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100 gap-2">
                            <span className="font-mono bg-slate-100 px-2 py-1 rounded">📍 {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}</span>
                            <span>{spot.date}</span>
                         </div>
                     </div>
                 ))}
             </div>
         )}
      </div>

    </motion.div>
  );
}
