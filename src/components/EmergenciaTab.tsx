import React from 'react';
import { motion } from 'motion/react';
import { PhoneCall, ShieldAlert, Crosshair, HeartPulse, Flame } from 'lucide-react';

export default function EmergenciaTab() {
  const contacts = [
    {
      id: 1,
      name: 'Corpo de Bombeiros / Defesa Civil',
      number: '193',
      desc: 'Resgates aquáticos, acidentes com embarcações e tempestades',
      icon: <Flame size={28} />,
      btnColor: 'bg-red-600 hover:bg-red-700 text-white'
    },
    {
      id: 2,
      name: 'SAMU (Emergência Médica)',
      number: '192',
      desc: 'Acidentes graves, afogamentos, mal súbito',
      icon: <HeartPulse size={28} />,
      btnColor: 'bg-rose-600 hover:bg-rose-700 text-white'
    },
    {
      id: 3,
      name: 'Polícia Militar / Ambiental',
      number: '190',
      desc: 'Segurança pública e crimes ambientais',
      icon: <ShieldAlert size={28} />,
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      id: 4,
      name: 'Hospital Regional Central',
      number: '(91) 3000-0000',
      desc: 'Atendimento geral e emergência presencial',
      icon: <Crosshair size={28} />,
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 text-red-600">
        <PhoneCall size={24} /> Telefones de Emergência
      </h2>

      <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-sm text-red-800">
          <p className="font-semibold mb-1">Dica de funcionamento:</p>
          <p>Números como 190, 192 e 193 <strong>funcionam sem créditos</strong> e podem utilizar qualquer rede de operadora disponível no local.</p>
      </div>

      <div className="space-y-4">
        {contacts.map(c => (
            <div key={c.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <div className={`p-4 rounded-full border border-slate-100 bg-slate-50 text-slate-700 transition-colors flex-shrink-0`}>
                    {c.icon}
                </div>
                <div className="flex-1 w-full">
                    <h3 className="font-bold text-slate-800 text-lg">{c.name}</h3>
                    <p className="text-sm text-slate-500 mt-1 mb-4">{c.desc}</p>
                    <a href={`tel:${c.number}`} className={`inline-flex items-center justify-center gap-2 ${c.btnColor} px-4 py-3 rounded-xl font-bold w-full transition-colors shadow-sm active:scale-95`}>
                        <PhoneCall size={18} /> Ligar para {c.number}
                    </a>
                </div>
            </div>
        ))}
      </div>
    </motion.div>
  );
}
