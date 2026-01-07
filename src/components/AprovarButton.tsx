"use client";

import { CheckCircle2 } from "lucide-react";

export function AprovarButton({ publicId, whatsappLink }: { publicId: string, whatsappLink: string }) {
  const handleAprovar = async () => {
    // 1. Avisa o banco que o cliente clicou em aprovar
    try {
      await fetch(`/api/orcamento/${publicId}/aprovar`, { method: "POST" });
    } catch (e) {
      console.error("Erro ao registrar aprovação");
    }
    // 2. Abre o WhatsApp
    window.open(whatsappLink, "_blank");
  };

  return (
    <button 
      onClick={handleAprovar}
      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-green-100 transition-all active:scale-95 text-lg cursor-pointer"
    >
      <CheckCircle2 size={24} /> Aprovar via WhatsApp
    </button>
  );
}