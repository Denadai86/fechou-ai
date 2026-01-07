import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs"; // <--- 1. IMPORTANDO O BOTÃO DE LOGOUT
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Plus, 
  FileText, 
  Clock, 
  ChevronRight, 
  Settings,
  Wallet,
  CheckCircle2,
  AlertCircle,
  XCircle // Ícone para recusado
} from "lucide-react";
import { DeleteButton } from "@/components/DeleteButton";
import { StatusBadge } from "@/components/StatusBadge";
import { DashboardControls } from "@/components/DashboardControls";
import { ProposalStatus, Prisma } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{ 
    q?: string; 
    status?: string; 
    sort?: string; 
  }>;
}

export default async function DashboardPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // --- FILTROS ---
  const query = searchParams.q || "";
  const statusFilter = searchParams.status as ProposalStatus | undefined;
  const sortOption = searchParams.sort || "date_desc";

  let orderBy: Prisma.ProposalOrderByWithRelationInput = { createdAt: 'desc' };
  switch (sortOption) {
    case 'date_asc': orderBy = { createdAt: 'asc' }; break;
    case 'val_desc': orderBy = { totalAmount: 'desc' }; break;
    case 'val_asc':  orderBy = { totalAmount: 'asc' }; break;
    default:         orderBy = { createdAt: 'desc' };
  }

  const whereClause: Prisma.ProposalWhereInput = {
    userId,
    title: { contains: query, mode: 'insensitive' },
    status: statusFilter ? statusFilter : undefined,
  };

  // --- BUSCA DE DADOS ---
  const [proposals, userProfile, statsGroup] = await Promise.all([
    prisma.proposal.findMany({ where: whereClause, orderBy }),
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.proposal.groupBy({
      by: ['status'],
      where: { userId },
      _sum: { totalAmount: true },
      _count: true
    })
  ]);

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const getStat = (status: ProposalStatus) => {
    const item = statsGroup.find(s => s.status === status);
    return {
      total: Number(item?._sum.totalAmount || 0),
      count: item?._count || 0
    };
  };

  const statAprovado = getStat('APROVADO');
  const statPago = getStat('PAGO');
  const statPendente = getStat('PENDENTE');
  const statRecusado = getStat('REJEITADO');

  // 2. NOVA LÓGICA: O "Volume Ativo" ignora o que foi perdido (recusado)
  const totalAtivo = statAprovado.total + statPago.total + statPendente.total;
  const countAtivo = statAprovado.count + statPago.count + statPendente.count;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* HEADER ATUALIZADO COM LOGOUT */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 mb-8 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg text-white">
                <FileText size={20} />
             </div>
             <span className="font-black text-xl tracking-tighter hidden md:block">FECHOU-AI</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Link para Configurações da Empresa */}
            <Link href="/dashboard/perfil" title="Configurar Empresa" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
               <Settings size={22} />
            </Link>
            
            {/* Divisória Visual */}
            <div className="h-6 w-px bg-slate-200"></div>

            {/* UserButton do Clerk (Sessão e Logout) */}
            <UserButton afterSignOutUrl="/"/>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-none">Visão Geral</h1>
            <p className="text-slate-500 mt-2 font-medium">Bem-vindo, {userProfile?.companyName || userProfile?.name || "Profissional"}.</p>
          </div>
          <Link href="/dashboard/novo">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-blue-200 transition-all active:scale-95 uppercase text-sm tracking-widest hover:-translate-y-1">
              <Plus size={20} /> Novo Orçamento
            </button>
          </Link>
        </div>

        {/* --- CARDS DE MÉTRICAS (GRID ADAPTATIVO 5 COLUNAS) --- */}
        {/* Usamos flex-wrap para telas menores e grid-cols-5 para telas grandes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
          
          {/* 1. GERAL (Só o Ativo) */}
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform text-white">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText size={60} className="text-white"/>
             </div>
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Pipeline Ativo</p>
             <h3 className="text-2xl font-black text-white">{formatMoney(totalAtivo)}</h3>
             <p className="text-xs text-slate-400 mt-1 font-bold">{countAtivo} na mesa</p>
          </div>

          {/* 2. PAGO (Verde) */}
          <div className="bg-green-50 p-5 rounded-3xl border border-green-100 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet size={60} className="text-green-600"/>
             </div>
             <p className="text-green-600 text-[10px] font-black uppercase tracking-widest mb-1">Caixa (Pago)</p>
             <h3 className="text-2xl font-black text-green-700">{formatMoney(statPago.total)}</h3>
             <p className="text-xs text-green-600 mt-1 font-bold">{statPago.count} realizados</p>
          </div>

          {/* 3. APROVADO (Azul) */}
          <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircle2 size={60} className="text-blue-600"/>
             </div>
             <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-1">Aprovado (À Receber)</p>
             <h3 className="text-2xl font-black text-blue-700">{formatMoney(statAprovado.total)}</h3>
             <p className="text-xs text-blue-500 mt-1 font-bold">{statAprovado.count} fechados</p>
          </div>

          {/* 4. PENDENTE (Amarelo) */}
          <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <AlertCircle size={60} className="text-amber-600"/>
             </div>
             <p className="text-amber-600 text-[10px] font-black uppercase tracking-widest mb-1">Aguardando</p>
             <h3 className="text-2xl font-black text-amber-800">{formatMoney(statPendente.total)}</h3>
             <p className="text-xs text-amber-600 mt-1 font-bold">{statPendente.count} propostas</p>
          </div>

           {/* 5. RECUSADO (Vermelho - NOVO) */}
           <div className="bg-red-50 p-5 rounded-3xl border border-red-100 shadow-sm relative overflow-hidden group opacity-80 hover:opacity-100 transition-opacity">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <XCircle size={60} className="text-red-600"/>
             </div>
             <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-1">Perdido / Recusado</p>
             <h3 className="text-2xl font-black text-red-700">{formatMoney(statRecusado.total)}</h3>
             <p className="text-xs text-red-500 mt-1 font-bold">{statRecusado.count} perdidos</p>
          </div>

        </div>

        <DashboardControls />

        <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">
          {query ? `Resultados para "${query}"` : "Atividades Recentes"}
        </h2>
        
        <div className="space-y-3">
          {proposals.length === 0 ? (
             <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center flex flex-col items-center justify-center gap-4">
                <div className="bg-slate-50 p-4 rounded-full">
                  <FileText className="text-slate-300 w-8 h-8" />
                </div>
                <p className="text-slate-400 font-medium italic">
                  {query || statusFilter 
                    ? "Nenhum orçamento encontrado com esses filtros." 
                    : "Você ainda não criou nenhum orçamento."}
                </p>
                {(query || statusFilter) && (
                  <Link href="/dashboard" className="text-blue-600 text-sm font-bold hover:underline">
                    Limpar filtros
                  </Link>
                )}
             </div>
          ) : (
            proposals.map((p) => (
                <div key={p.id} className="bg-white p-2 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <Link href={`/dashboard/orcamento/${p.id}`} className="flex items-center gap-4 flex-1 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors flex-shrink-0
                      ${p.status === 'APROVADO' ? 'bg-blue-100 text-blue-600' : 
                        p.status === 'PAGO' ? 'bg-green-100 text-green-600' : 
                        p.status === 'REJEITADO' ? 'bg-red-100 text-red-600' : 
                        'bg-amber-100 text-amber-600'}`}>
                        {/* Ícone muda conforme status */}
                        {p.status === 'PAGO' ? <Wallet size={20} /> : 
                         p.status === 'REJEITADO' ? <XCircle size={20} /> : 
                         p.status === 'APROVADO' ? <CheckCircle2 size={20} /> :
                         <Clock size={20} />}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight truncate">
                          {p.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-bold flex items-center gap-2">
                          {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          #{p.numero}
                        </p>
                    </div>
                  </Link>

                  <div className="flex items-center justify-between md:justify-end gap-6 px-4 md:px-6 pb-2 md:pb-0">
                    <div className="text-right">
                        <p className="font-black text-slate-900 text-lg md:text-base">{formatMoney(Number(p.totalAmount))}</p>
                        <div className="flex justify-end mt-1">
                          <StatusBadge id={p.id} currentStatus={p.status} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
                        <DeleteButton id={p.id} />
                        <Link href={`/dashboard/orcamento/${p.id}`} className="p-2 md:p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all">
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </main>
    </div>
  );
}