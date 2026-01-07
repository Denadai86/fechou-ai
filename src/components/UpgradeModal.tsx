"use client";

import { X, CheckCircle2, Zap, Crown } from "lucide-react";
import { criarCheckoutAssinatura } from "@/app/dashboard/actions";
import { useState } from "react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      await criarCheckoutAssinatura(); // Chama a Server Action
    } catch (err) {
      alert("Erro ao abrir pagamento. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Cabeçalho */}
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="relative z-10">
             <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Crown className="text-white w-8 h-8" />
             </div>
             <h2 className="text-2xl font-black text-white mb-2">Seu Limite Grátis Acabou</h2>
             <p className="text-slate-300 text-sm">Desbloqueie todo o poder da IA agora mesmo.</p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-8">
          <div className="space-y-4 mb-8">
            <Feature text="Orçamentos Ilimitados" />
            <Feature text="Prioridade na IA (Mais rápido)" />
            <Feature text="Remoção da marca d'água" />
            <Feature text="Suporte VIP no WhatsApp" />
          </div>

          {/* Preço */}
          <div className="text-center mb-8">
             <span className="text-3xl font-black text-slate-900">R$ 29,90</span>
             <span className="text-slate-500 font-medium">/mês</span>
             <p className="text-xs text-green-600 font-bold mt-1">Cancele quando quiser</p>
          </div>

          <button 
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? "Carregando..." : <><Zap size={20} className="fill-current" /> QUERO SER PRO</>}
          </button>
        </div>

      </div>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />
      <span className="text-slate-700 font-medium text-sm">{text}</span>
    </div>
  );
}