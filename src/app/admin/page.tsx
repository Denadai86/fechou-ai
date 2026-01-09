import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server"; // Usamos currentUser para pegar o email
import { redirect } from "next/navigation";
import { Users, CreditCard, TrendingUp, DollarSign, Activity, AlertCircle, BarChart3, Lock } from "lucide-react";

export default async function AdminDashboard() {
  const user = await currentUser();
  const emailLogado = user?.emailAddresses[0]?.emailAddress;

  // 🔒 TRAVA DE SEGURANÇA 🔒
  // Se não tiver usuário, ou se o email não for o do ADMIN, expulsa para o dashboard comum.
  // Certifique-se de adicionar ADMIN_EMAIL=seu@email.com no seu arquivo .env
  if (!emailLogado || emailLogado !== process.env.ADMIN_EMAIL) {
    console.warn(`Tentativa de acesso não autorizado ao Admin por: ${emailLogado}`);
    redirect("/dashboard");
  }

  const totalUsers = await prisma.user.count();
  const proUsers = await prisma.user.count({ where: { plan: "PRO" } });
  
  // Cálculo de MRR (SaaS)
  const mrr = proUsers * 29.90;

  const users = await prisma.user.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    select: { 
      email: true, 
      plan: true, 
      companyName: true, 
      createdAt: true, 
      _count: { select: { proposals: true } },
      proposals: {
        select: {
          totalAmount: true,
          status: true
        }
      }
    }
  });

  // Cálculo do Volume Total Transacionado (Soma de todos os orçamentos de todos os usuários)
  // Usamos Number() para garantir que não haja concatenação de strings
  const volumeTotal = users.reduce((accTotal, u) => {
    const totalUser = u.proposals.reduce((acc, p) => acc + Number(p.totalAmount || 0), 0);
    return accTotal + totalUser;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 font-sans">
      
      {/* HEADER DARK */}
      <header className="bg-slate-900 text-white pt-12 pb-24 px-8 shadow-xl">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2 text-slate-400">
               <Lock size={12} />
               <p className="text-xs font-bold uppercase tracking-widest">Área Restrita</p>
            </div>
            <h1 className="text-4xl font-black tracking-tight">Fechou-AI Admin</h1>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-sm font-medium text-slate-300">Admin Logado: {emailLogado}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-16">
        
        {/* GRID DE KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           <KPICard 
             title="Total de Usuários" 
             value={totalUsers} 
             icon={<Users className="text-blue-400" />} 
           />
           <KPICard 
             title="Assinantes PRO" 
             value={proUsers} 
             icon={<CreditCard className="text-purple-400" />} 
             highlight 
           />
           <KPICard 
             title="MRR Estimado" 
             value={mrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
             icon={<DollarSign className="text-green-400" />} 
             subtitle="Recorrência Mensal"
           />
           <KPICard 
             title="Volume Transacionado" 
             value={volumeTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
             icon={<BarChart3 className="text-orange-400" />} 
             subtitle="Soma de orçamentos"
           />
        </div>

        {/* TABELA DE USUÁRIOS */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Activity size={18} className="text-slate-400" />
                Performance dos Usuários
              </h2>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                   <th className="p-5">Cliente</th>
                   <th className="p-5">Plano</th>
                   <th className="p-5">Volume Orçado</th>
                   <th className="p-5 text-center">Conv.</th>
                   <th className="p-5 text-right">Entrou em</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {users.map((u) => {
                   // CORREÇÃO MATEMÁTICA: Forçamos Number() para evitar concatenação de strings
                   const totalOrcado = u.proposals.reduce((acc, p) => acc + Number(p.totalAmount || 0), 0);
                   
                   const aceitos = u.proposals.filter(p => 
                        ['ACCEPTED', 'APPROVED', 'PAID', 'COMPLETED'].includes(p.status)
                    ).length
                   const total = u.proposals.length;
                   const conversao = total > 0 ? ((aceitos / total) * 100).toFixed(0) : 0;

                   return (
                     <tr key={u.email} className="hover:bg-slate-50/80 transition-colors group">
                       <td className="p-5">
                          <div className="font-bold text-slate-800">{u.companyName || "Sem Empresa"}</div>
                          <div className="text-xs text-slate-400 font-mono">{u.email}</div>
                       </td>
                       <td className="p-5">
                         {u.plan === "PRO" ? (
                           <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                             PRO ⚡
                           </span>
                         ) : (
                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                             FREE
                           </span>
                         )}
                       </td>
                       <td className="p-5 font-mono text-slate-700">
                          {/* Formatação correta de moeda brasileira */}
                          {totalOrcado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          <div className="text-[10px] text-slate-400">{total} orçamentos</div>
                       </td>
                       <td className="p-5 text-center">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${Number(conversao) > 30 ? 'bg-green-100 text-green-700' : 'text-slate-500 bg-slate-100'}`}>
                            {conversao}%
                          </span>
                       </td>
                       <td className="p-5 text-right text-sm text-slate-500 font-mono">
                         {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                       </td>
                     </tr>
                   )
                 })}
               </tbody>
             </table>
           </div>
        </div>

      </main>
    </div>
  );
}

function KPICard({ title, value, icon, subtitle, trend, highlight = false }: any) {
  return (
    <div className={`p-6 rounded-2xl border shadow-sm transition-all hover:-translate-y-1 ${
      highlight 
        ? "bg-slate-900 text-white border-slate-700 shadow-slate-900/20" 
        : "bg-white text-slate-900 border-slate-200"
    }`}>
      <div className="flex justify-between items-start mb-4">
         <div>
            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${highlight ? "text-slate-400" : "text-slate-500"}`}>
              {title}
            </p>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight truncate max-w-[200px]" title={String(value)}>{value}</h3>
         </div>
         <div className={`p-3 rounded-xl ${highlight ? "bg-slate-800" : "bg-slate-50"}`}>
           {icon}
         </div>
      </div>
      
      {(subtitle || trend) && (
        <div className="flex items-center gap-2 text-xs font-medium pt-4 border-t border-slate-100/10">
           {trend && <span className="text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">{trend}</span>}
           <span className={highlight ? "text-slate-500" : "text-slate-400"}>{subtitle}</span>
        </div>
      )}
    </div>
  );
}