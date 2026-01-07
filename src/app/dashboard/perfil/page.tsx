// src/app/dashboard/perfil/page.tsx

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; 
import { PerfilForm } from "./PerfilForm";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Building2 } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ msg?: string }>;
}

export default async function PerfilPage({ searchParams }: PageProps) {
  // 1. Unwrappe do searchParams para Next.js 16
  const { msg } = await searchParams;

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // Busca perfil no banco
  const perfil = await prisma.user.findUnique({
    where: { id: user.id },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* AVISO DE CADASTRO PENDENTE */}
      {msg === "complete_cadastro" && (
        <div className="bg-amber-50 border-b border-amber-200 p-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="max-w-4xl mx-auto flex items-center gap-3 text-amber-800">
                <div className="bg-amber-100 p-2 rounded-full">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-tight">Cadastro Necessário</p>
                  <p className="text-sm opacity-90">Preencha seus dados de contato e empresa abaixo para começar a gerar orçamentos.</p>
                </div>
            </div>
        </div>
      )}

      {/* HEADER */}
      <nav className="bg-white border-b border-slate-200 px-6 py-5 mb-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-black text-xl uppercase tracking-tighter">Perfil do Negócio</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Configure sua identidade visual</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <Building2 size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">{perfil?.companyName || "Configuração"}</span>
          </div>
        </div>
      </nav>

      {/* FORMULÁRIO */}
      <main className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
           <p className="text-slate-500 text-sm italic">
             Essas informações serão usadas pela IA para preencher automaticamente o cabeçalho e rodapé de todos os seus orçamentos.
           </p>
        </div>
        
        <PerfilForm initialData={perfil} />
      </main>
    </div>
  );
}