"use client";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors cursor-pointer">
      <Printer size={18} /> <span className="hidden sm:inline">Imprimir</span>
    </button>
  );
}