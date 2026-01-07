"use client";

import { useState } from "react";
import { updateProposalStatus } from "@/app/dashboard/actions";
import { ProposalStatus } from "@prisma/client";
import { Loader2, ChevronDown } from "lucide-react";

// Mapeamento de cores para cada status
const statusConfig = {
  PENDENTE: { label: "Pendente", style: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  APROVADO: { label: "Aprovado", style: "bg-blue-100 text-blue-700 border-blue-200" },
  PAGO:     { label: "Pago",     style: "bg-green-100 text-green-700 border-green-200" },
  REJEITADO:{ label: "Recusado", style: "bg-red-100 text-red-700 border-red-200" },
};

export function StatusBadge({ id, currentStatus }: { id: string, currentStatus: ProposalStatus }) {
  const [loading, setLoading] = useState(false);
  
  // O status vem do banco. Se não vier, assume PENDENTE.
  const statusKey = currentStatus || "PENDENTE";
  const currentConfig = statusConfig[statusKey] || statusConfig.PENDENTE;

  const handleStatusChange = async (newStatus: ProposalStatus) => {
    setLoading(true);
    try {
      await updateProposalStatus(id, newStatus);
      // O revalidatePath do servidor vai atualizar a UI, 
      // mas podemos forçar um feedback visual se quiser.
    } catch (err) {
      alert("Erro ao atualizar status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group inline-block">
      {/* O Botão Principal */}
      <button 
        disabled={loading}
        className={`
          ${currentConfig.style} 
          px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border 
          flex items-center gap-2 cursor-pointer transition-all hover:brightness-95
        `}
      >
        {loading ? <Loader2 size={10} className="animate-spin" /> : currentConfig.label}
        <ChevronDown size={10} />
      </button>

      {/* Menu Dropdown (Aparece ao passar o mouse) */}
      <div className="absolute top-full right-0 mt-1 hidden group-hover:flex flex-col bg-white border border-slate-200 rounded-xl shadow-xl z-20 w-32 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {Object.keys(statusConfig).map((key) => (
          <button
            key={key}
            onClick={() => handleStatusChange(key as ProposalStatus)}
            className="px-4 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 text-left border-b last:border-0 border-slate-100 uppercase tracking-tighter"
          >
            {statusConfig[key as ProposalStatus].label}
          </button>
        ))}
      </div>
    </div>
  );
}