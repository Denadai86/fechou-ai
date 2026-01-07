"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteProposal } from "@/app/dashboard/actions";

export function DeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja apagar este orçamento?")) return;
    
    setLoading(true);
    try {
      await deleteProposal(id);
    } catch (err) {
      alert("Erro ao deletar.");
      setLoading(false);
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="p-3 text-slate-300 hover:text-red-600 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {loading ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
    </button>
  );
}
