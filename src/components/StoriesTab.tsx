import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Story } from '../types';

export default function StoriesTab() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('pc_stories');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    location: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Não foi possível acessar o microfone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toBase64 = (blob: Blob): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let audioDataUrl = undefined;
    
    if (audioBlob) {
        try {
            audioDataUrl = await toBase64(audioBlob);
        } catch (e) {
            console.error("Failed to convert audio", e);
        }
    }

    const newStory: Story = {
      id: Date.now().toString(),
      ...formData,
      audioUrl: audioDataUrl,
      date: new Date().toLocaleDateString()
    };

    const updated = [newStory, ...stories];
    setStories(updated);
    try {
        localStorage.setItem('pc_stories', JSON.stringify(updated));
    } catch (e) {
        alert("Limite de armazenamento excedido. Tente salvar sem áudio.");
        updated[0].audioUrl = undefined;
        localStorage.setItem('pc_stories', JSON.stringify(updated));
    }

    setFormData({ title: '', author: '', location: '', category: '', description: '' });
    setAudioBlob(null);
    setAudioUrl(null);
    alert('História salva com sucesso!');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 text-blue-900">
        <span>🎙️</span> Histórias Orais
      </h2>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-700 mb-4">Gravar Nova História</h3>
        
        <div className="flex gap-2 mb-4">
          {!isRecording ? (
            <button onClick={startRecording} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-lg flex justify-center items-center gap-2 border border-red-200 transition-colors">
              <span className="w-3 h-3 rounded-full bg-red-500"></span> Iniciar Gravação
            </button>
          ) : (
            <button onClick={stopRecording} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors shadow-sm">
              <span className="w-3 h-3 rounded-sm bg-white"></span> Parar Gravação
            </button>
          )}
        </div>

        {isRecording && (
          <div className="flex items-center justify-center gap-2 text-red-500 font-medium animate-pulse bg-red-50 p-2 rounded-lg">
            Gravando... {formatTime(recordingTime)}
          </div>
        )}

        {audioUrl && !isRecording && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800 mb-2 font-medium">Gravação pronta:</p>
            <audio src={audioUrl} controls className="w-full h-10 mb-2" />
            <button type="button" onClick={() => {setAudioUrl(null); setAudioBlob(null);}} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">🗑️ Descartar Gravação</button>
          </motion.div>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-700 mb-4">Detalhes da História</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título da História *</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: A lenda do boto..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Contador(a) *</label>
            <input required type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Nome do pescador(a)..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Local da Comunidade *</label>
            <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ex: Comunidade do Soure..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoria *</label>
            <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                <option value="">Selecione...</option>
                <option value="lenda">Lenda/Mitologia</option>
                <option value="pesca">História de Pesca</option>
                <option value="tradicional">Tradição Cultural</option>
                <option value="experiencia">Experiência de Vida</option>
                <option value="natureza">Natureza/Rio</option>
                <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Breve descrição da história..."></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm focus:ring-4 focus:ring-blue-200">
            💾 Salvar História
          </button>
        </form>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
         <div className="flex justify-between items-center mb-4">
             <h3 className="font-semibold text-slate-700">Histórias Salvas ({stories.length})</h3>
             <button className="text-sm font-medium text-blue-600 hover:text-blue-800">📤 Exportar</button>
         </div>
         
         {stories.length === 0 ? (
             <p className="text-slate-500 text-sm text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">Nenhuma história registrada ainda.</p>
         ) : (
             <div className="space-y-4">
                 {stories.map(story => (
                     <div key={story.id} className="border border-slate-200 p-4 rounded-xl bg-white shadow-sm">
                         <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-slate-800">{story.title}</h4>
                             <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium border border-indigo-100">{story.category}</span>
                         </div>
                         <p className="text-sm text-slate-600 mb-2 font-medium">👤 {story.author} &bull; 📍 {story.location}</p>
                         {story.description && <p className="text-sm text-slate-500 mb-3 italic">"{story.description}"</p>}
                         {story.audioUrl && (
                             <div className="mt-3 bg-slate-50 rounded-lg p-2 border border-slate-100">
                                <audio src={story.audioUrl} controls className="w-full h-8" />
                             </div>
                         )}
                         <div className="text-xs text-slate-400 mt-3 flex justify-between">
                            <span>Registrado em:</span>
                            <span>{story.date}</span>
                         </div>
                     </div>
                 ))}
             </div>
         )}
      </div>
    </motion.div>
  );
}
