import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Newspaper, ExternalLink } from 'lucide-react';

export default function NoticiasTab() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/noticias')
      .then(async res => {
         if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.details || "Erro de servidor");
         }
         return res.json();
      })
      .then(json => {
         // API might return data directly or wrapped in an array depending on AI output, assuming array of objects
         setNews(Array.isArray(json) ? json : []);
         setLoading(false);
      })
      .catch((err) => {
         console.error("Erro na API de Notícias:", err.message);
         setError(err.message);
         setLoading(false);
      });
  }, []);

  if (loading) {
    return (
       <div className="flex flex-col items-center justify-center p-12 text-slate-500 gap-4">
         <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
         <p>Buscando últimas notícias...</p>
       </div>
    );
  }

  if (error || news.length === 0) {
    return (
       <div className="p-6 text-center text-red-600 bg-red-50 rounded-2xl">
         <p>Não foi possível carregar as notícias no momento. Tente novamente mais tarde.</p>
         <p className="text-xs mt-2 opacity-70">Detalhes: {error}</p>
       </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-700">
        <Newspaper size={24} /> Notícias MAPA/Aquicultura
      </h2>

      <div className="space-y-4">
        {news.map(item => (
            <a key={item.id} href={item.url || '#'} target="_blank" rel="noreferrer" className="block bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{item.source}</span>
                    <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 group-hover:text-indigo-700 transition-colors">
                    {item.title}
                </h3>
                <p className="text-sm text-slate-600 mb-3">{item.summary}</p>
                <div className="flex justify-end text-indigo-500 text-sm font-medium items-center gap-1 group-hover:text-indigo-600">
                    Ler matéria completa <ExternalLink size={14} />
                </div>
            </a>
        ))}
      </div>
    </motion.div>
  );
}
