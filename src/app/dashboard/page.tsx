import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Plus, 
  FileText, 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  UserCircle,
  Settings
} from "lucide-react";
import { DeleteButton } from "@//components/DeleteButton"; // Vamos criar esse já já
import { StatusBadge } from "@/components/StatusBadge";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Busca orçamentos e perfil
  const [proposals, userProfile] = await Promise.all([
    prisma.proposal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: userId },
    }),
  ]);

  const totalValor = proposals.reduce((acc: number, p: typeof proposals[0]) => acc + Number(p.totalAmount), 0);
  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* HEADER SUPERIOR */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 mb-8 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg text-white">
                <TrendingUp size={20} />
             </div>
             <span className="font-black text-xl tracking-tighter">FECHOU-AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/perfil" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
               <Settings size={22} />
            </Link>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                {userProfile?.logoUrl ? (
                    <img src={userProfile.logoUrl} className="w-full h-full object-cover" />
                ) : <UserCircle className="w-full h-full text-slate-400" />}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6">
        {/* BOAS VINDAS E BOTÃO NOVO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-none">Painel Geral</h1>
            <p className="text-slate-500 mt-2 font-medium">Bem-vindo, {userProfile?.companyName || "Profissional"}.</p>
          </div>
          <Link href="/dashboard/novo">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-blue-200 transition-all active:scale-95 uppercase text-sm tracking-widest">
              <Plus size={20} /> Novo Orçamento
            </button>
          </Link>
        </div>

        {/* CARDS DE MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Total de Orçamentos</p>
             <div className="flex items-center gap-3">
                <FileText className="text-blue-600" />
                <span className="text-3xl font-black">{proposals.length}</span>
             </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm md:col-span-2">
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Volume de Negócios (Bruto)</p>
             <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                    <TrendingUp size={20} />
                </div>
                <span className="text-3xl font-black text-slate-900">{formatMoney(totalValor)}</span>
             </div>
          </div>
        </div>

        {/* LISTA DE ORÇAMENTOS */}
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Atividades Recentes</h2>
        <div className="space-y-4">
          {proposals.length === 0 ? (
             <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
                <p className="text-slate-400 font-medium italic">Você ainda não criou nenhum orçamento.</p>
             </div>
          ) : (
            proposals.map((p: typeof proposals[0]) => (
                <div key={p.id} className="bg-white p-2 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
                  <Link href={`/dashboard/orcamento/${p.id}`} className="flex items-center gap-4 flex-1 p-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight">{p.title}</h3>
                        <p className="text-xs text-slate-400 font-bold">{new Date(p.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-6 pr-6">
                    <div className="text-right">
                        <p className="font-black text-slate-900">{formatMoney(Number(p.totalAmount))}</p>
                        <StatusBadge id={p.id} currentStatus={p.status} />
                    </div>
                    <div className="flex items-center gap-2">
                        <DeleteButton id={p.id} />
                        <Link href={`/dashboard/orcamento/${p.id}`} className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all">
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