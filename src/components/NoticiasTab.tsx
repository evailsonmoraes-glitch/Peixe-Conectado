import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, ExternalLink } from 'lucide-react';

export default function NoticiasTab() {
  const news = [
    {
       id: 1,
       title: "MAPA lança novo edital de fomento à aquicultura familiar",
       date: "Hoje",
       source: "Ministério da Agricultura",
       summary: "Novas linhas de crédito para pequenos produtores de pescado em nossa região. Inscrições abertas até o final do mês."
    },
    {
       id: 2,
       title: "Período de defeso do Tambaqui: regras e fiscalização",
       date: "Ontem",
       source: "IBAMA / MPA",
       summary: "Saiba quais são as restrições e como garantir o registro de pescador para o seguro defeso durante a piracema."
    },
    {
       id: 3,
       title: "Boas práticas de manejo sanitário na aquicultura",
       date: "20 Mai 2026",
       source: "Embrapa",
       summary: "Técnicos recomendam cuidados com a temperatura e qualidade da água nos viveiros escavados."
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-700">
        <Newspaper size={24} /> Notícias de Aquicultura
      </h2>

      <div className="space-y-4">
        {news.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group">
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
            </div>
        ))}
      </div>
    </motion.div>
  );
}
