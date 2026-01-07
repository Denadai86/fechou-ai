"use client";

import { Search, Filter, ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function DashboardControls() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  
  // Estados locais para controle imediato do input
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  // Debounce para não atualizar a URL a cada letra digitada
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set("q", searchTerm);
      } else {
        params.delete("q");
      }
      replace(`/dashboard?${params.toString()}`);
    }, 500); // 500ms de atraso

    return () => clearTimeout(handler);
  }, [searchTerm, replace, searchParams]);

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    replace(`/dashboard?${params.toString()}`);
  };

  const handleStatus = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === "ALL") params.delete("status");
    else params.set("status", status);
    replace(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      {/* BUSCA */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
          placeholder="Buscar por cliente ou título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* FILTRO STATUS */}
      <div className="relative min-w-40">
         <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
         <select
            className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium appearance-none cursor-pointer text-slate-600"
            onChange={(e) => handleStatus(e.target.value)}
            defaultValue={searchParams.get("status") || "ALL"}
         >
            <option value="ALL">Todos Status</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="APROVADO">Aprovados</option>
            <option value="PAGO">Pagos</option>
            <option value="REJEITADO">Recusados</option>
         </select>
      </div>

      {/* ORDENAÇÃO */}
      <div className="relative min-w-40">
         <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
         <select
            className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium appearance-none cursor-pointer text-slate-600"
            onChange={(e) => handleSort(e.target.value)}
            defaultValue={searchParams.get("sort") || "date_desc"}
         >
            <option value="date_desc">Mais Recentes</option>
            <option value="date_asc">Mais Antigos</option>
            <option value="val_desc">Maior Valor</option>
            <option value="val_asc">Menor Valor</option>
         </select>
      </div>
    </div>
  );
}