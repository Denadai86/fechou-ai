//src/app/dashboard/page.tsx

import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { History, Mic } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* --- NAVBAR --- */}
      <nav className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            Fechou<span className="text-blue-600">ai</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden md:block">
              Olá, {user?.firstName}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* --- CONTEÚDO --- */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl font-bold text-slate-800">Meus Orçamentos</h1>
          <p className="text-slate-500">Gerencie suas propostas ou crie uma nova.</p>
        </div>

        {/* BOTÃO MÁGICO DE CRIAR */}
        <Link href="/dashboard/novo">
          <div className="bg-white border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer group mb-10 shadow-sm hover:shadow-md">
            <div className="bg-blue-100 p-4 rounded-full group-hover:scale-110 transition-transform mb-4">
              <Mic className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-blue-900 mb-1">Criar Novo Orçamento</h2>
            <p className="text-slate-500 text-sm">Clique para gravar um áudio</p>
          </div>
        </Link>

        {/* LISTA VAZIA */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <History size={16} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Histórico Recente</span>
          </div>
          <div className="p-12 text-center text-slate-400">
            <p>Você ainda não tem orçamentos.</p>
          </div>
        </div>
      </main>
    </div>
  );
}