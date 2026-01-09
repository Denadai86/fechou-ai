// src/app/dashboard/perfil/page.tsx

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; 
import { PerfilForm } from "./PerfilForm";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Building2, CreditCard } from "lucide-react";
import { buscarDadosAssinatura, cancelarAssinatura } from "./actions"; // Importe a função que criamos

interface PageProps {
  searchParams: Promise<{ msg?: string }>;
}

export default async function PerfilPage({ searchParams }: PageProps) {
  // 1. Unwrappe do searchParams
  const { msg } = await searchParams;

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // 2. Busca perfil no banco
  const perfil = await prisma.user.findUnique({
    where: { id: user.id },
  });

  // 3. Busca dados do Mercado Pago (Server Side)
  const dadosAssinatura = await buscarDadosAssinatura();

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
      <nav className="bg-white border-b border-slate-200 px-6 py-5 mb-8 sticky top-0 z-10 shadow-sm backdrop-blur-md bg-white/80">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-black text-xl uppercase tracking-tighter text-slate-800">Perfil do Negócio</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Configure sua identidade visual</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            <Building2 size={14} />
            <span className="text-xs font-bold uppercase tracking-widest">{perfil?.companyName || "Configuração"}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* SEÇÃO DE ASSINATURA (NOVA) */}
        {dadosAssinatura && (
           <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                 <CreditCard size={120} />
              </div>
              
              <div className="relative z-10">
                 <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                    <CreditCard className="text-blue-600" size={20}/> 
                    Gerenciar Assinatura
                 </h2>
                 
                 <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-4">
                       <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Status do Plano</p>
                          <div className="flex items-center gap-3">
                             <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                                dadosAssinatura.status === 'authorized' 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                             }`}>
                                {dadosAssinatura.status === 'authorized' ? 'Ativo (PRO)' : dadosAssinatura.status}
                             </span>
                             <span className="text-sm font-medium text-slate-500">
                               R$ {dadosAssinatura.valor?.toFixed(2)}/mês
                             </span>
                          </div>
                       </div>
                       
                       {dadosAssinatura.proximoPagamento && (
                          <div>
                             <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Próxima Cobrança</p>
                             <p className="font-medium text-slate-700">
                                {new Date(dadosAssinatura.proximoPagamento).toLocaleDateString('pt-BR')}
                             </p>
                          </div>
                       )}
                    </div>

                    {/* Botão de Cancelar (Server Action direto no botão) */}
                    {dadosAssinatura.status === 'authorized' && (
                       <div className="md:self-center">
                          <form action={async () => {
                             "use server";
                             if (dadosAssinatura.id) await cancelarAssinatura(dadosAssinatura.id);
                          }}>
                             <button className="text-red-600 hover:text-red-700 text-sm font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-100">
                                Cancelar Assinatura
                             </button>
                          </form>
                       </div>
                    )}
                 </div>
              </div>
           </section>
        )}

        <div className="mb-8">
           <p className="text-slate-500 text-sm italic bg-blue-50/50 p-4 rounded-xl border border-blue-100">
             ℹ️ Essas informações serão usadas pela IA para preencher automaticamente o cabeçalho e rodapé de todos os seus orçamentos.
           </p>
        </div>
        
        {/* Passamos o perfil para o formulário editar */}
        <PerfilForm initialData={perfil} />
      </main>
    </div>
  );
}