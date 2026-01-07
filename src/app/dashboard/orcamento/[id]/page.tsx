import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wallet, Calendar, CheckCircle2, Edit } from "lucide-react";

// Componentes Client-Side
import { PrintButton } from "@/components/PrintButton";
import { CopyLinkButton } from "@/components/CopyLinkButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrcamentoDetalhe({ params }: PageProps) {
  // 1. Next.js 16: Aguarda os parâmetros da rota
  const { id } = await params;

  // 2. Autenticação e Segurança
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // 3. Busca dos dados
  const orcamento = await prisma.proposal.findUnique({
    where: { 
      id: id,
      userId: userId 
    },
    include: {
      items: true,
      user: true
    }
  });

  if (!orcamento) return notFound();

  // Helpers
  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const publicUrl = `${baseUrl}/p/${orcamento.publicId}`;

  // Cálculo do desconto à vista (5%) para exibição
  const total = Number(orcamento.totalAmount);
  const totalComDesconto = total * 0.95;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20 print:bg-white">
      
      {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
      <nav className="bg-slate-900 text-white px-4 py-4 print:hidden sticky top-0 z-10 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 hover:text-slate-300 transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="hidden sm:inline font-medium">Voltar</span>
          </Link>
          
          <div className="flex gap-2 sm:gap-4 items-center">
             {/* --- NOVO BOTÃO DE EDITAR --- */}
             <Link href={`/dashboard/orcamento/${id}/editar`}>
               <button className="bg-slate-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-600 transition-colors cursor-pointer">
                 <Edit size={18} /> <span className="hidden sm:inline">Editar</span>
               </button>
             </Link>
             {/* --------------------------- */}

             <CopyLinkButton url={publicUrl} />
             <PrintButton />
          </div>
        </div>
      </nav>

      {/* A FOLHA A4 DO ORÇAMENTO */}
      <main className="max-w-4xl mx-auto mt-8 bg-white p-8 md:p-16 shadow-2xl print:shadow-none print:mt-0 print:p-0 rounded-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Marca d'água sutil no fundo */}
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <CheckCircle2 size={300} />
        </div>

        {/* CABEÇALHO COM LOGO DINÂMICA */}
        <header className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-100 pb-10 mb-10 relative z-10 gap-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left w-full md:w-auto">
            
            {/* LOGO DO USUÁRIO */}
            {orcamento.user.logoUrl ? (
              <div className="w-24 h-24 md:w-32 md:h-32 relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                <img 
                  src={orcamento.user.logoUrl} 
                  alt="Logo" 
                  className="w-full h-full object-contain p-2"
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shrink-0 shadow-lg shadow-blue-100">
                {orcamento.user.companyName?.charAt(0) || orcamento.user.name?.charAt(0)}
              </div>
            )}

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
                {orcamento.user.companyName || orcamento.user.name}
              </h1>
              <div className="text-slate-500 text-sm leading-relaxed">
                <p className="font-bold text-slate-700">{orcamento.user.address}</p>
                <p>{orcamento.user.phone} • {orcamento.user.email}</p>
                {orcamento.user.cpfCnpj && (
                  <p className="opacity-75 font-mono text-xs">CNPJ/CPF: {orcamento.user.cpfCnpj}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Valor à direita se mantém igual */}
          <div className="w-full md:w-auto text-right flex flex-col items-center md:items-end">
             <div className="inline-block bg-slate-900 text-white rounded-xl p-6 shadow-xl w-full md:w-auto text-center">
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-70 mb-1">Valor Total</p>
                <p className="text-3xl font-bold">{formatMoney(total)}</p>
             </div>
             <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Emissão: {new Date(orcamento.createdAt).toLocaleDateString('pt-BR')}
             </p>
          </div>
        </header>

        {/* TÍTULO E DESCRIÇÃO */}
        <section className="mb-12 relative z-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{orcamento.title}</h2>
          <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-line border-l-4 border-blue-500 pl-6 bg-slate-50 py-4 pr-4 rounded-r-lg">
            {orcamento.description}
          </div>
        </section>

        {/* TABELA DE ITENS (ATUALIZADA COM QTD E UNITÁRIO) */}
        <section className="mb-12 overflow-x-auto relative z-10">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b-2 border-slate-900 text-slate-900">
                 <th className="py-4 font-black uppercase text-xs tracking-widest w-12 text-center text-slate-400">#</th>
                 <th className="py-4 font-black uppercase text-xs tracking-widest">Descrição do Item</th>
                 <th className="py-4 font-black uppercase text-xs tracking-widest text-center w-24">Qtd</th>
                 <th className="py-4 font-black uppercase text-xs tracking-widest text-right w-32">Unitário</th>
                 <th className="py-4 font-black uppercase text-xs tracking-widest text-right w-32">Total</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {orcamento.items.map((item, index) => (
                 <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                   <td className="py-4 text-center text-slate-400 font-mono text-xs">{index + 1}</td>
                   <td className="py-4 text-slate-700 font-medium">
                      {item.description}
                   </td>
                   <td className="py-4 text-center text-slate-600 font-medium bg-slate-50/50 rounded-lg">
                      {item.quantity}
                   </td>
                   <td className="py-4 text-right text-slate-500 text-sm">
                      {formatMoney(Number(item.unitPrice))}
                   </td>
                   <td className="py-4 text-right font-bold text-slate-900">
                     {formatMoney(Number(item.totalPrice))}
                   </td>
                 </tr>
               ))}
             </tbody>
             
             {/* RODAPÉ DA TABELA */}
             <tfoot>
                <tr>
                    <td colSpan={5} className="pt-6"></td>
                </tr>
                <tr className="border-t-2 border-slate-100">
                  <td colSpan={3}></td>
                  <td className="pt-4 text-right font-bold text-slate-500 text-sm uppercase">Total Bruto</td>
                  <td className="pt-4 text-right font-bold text-slate-700 text-lg">
                    {formatMoney(total)}
                  </td>
                </tr>
                {/* Linha de Desconto - Gatilho Mental */}
                <tr>
                  <td colSpan={3}></td>
                  <td className="pt-1 text-right font-bold text-green-600 text-xs uppercase tracking-wider">
                    À vista (5% OFF)
                  </td>
                  <td className="pt-1 text-right font-black text-green-600 text-xl">
                    {formatMoney(totalComDesconto)}
                  </td>
                </tr>
             </tfoot>
           </table>
        </section>

        {/* PAGAMENTO E ASSINATURA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t-2 border-slate-100 relative z-10">
           
           {/* BLOCO DE PAGAMENTO */}
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Wallet size={18} className="text-blue-600" /> Dados Bancários
              </h3>
              <div className="space-y-3 text-sm">
                 <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-400 uppercase font-bold">Chave PIX</p>
                    <p className="text-slate-800 font-mono text-base font-medium truncate">
                        {orcamento.user.pixKey || "Consulte o profissional"}
                    </p>
                 </div>
                 
                 {orcamento.user.pixHolder && (
                   <p className="text-slate-600 px-1">
                     <span className="font-bold">Titular:</span> {orcamento.user.pixHolder}
                   </p>
                 )}
                 
                 {orcamento.user.bankDetails && (
                   <p className="text-slate-500 text-xs mt-4 leading-relaxed border-t border-slate-200 pt-2 italic">
                     {orcamento.user.bankDetails}
                   </p>
                 )}
              </div>
           </div>

           {/* BLOCO DE VALIDADE E ASSINATURA */}
           <div className="flex flex-col justify-between text-right">
              <div className="text-slate-500 text-sm font-medium space-y-2">
                 <p className="flex items-center justify-end gap-2">
                   <Calendar size={16} className="text-blue-600" /> 
                   Validade da Proposta: <span className="font-bold text-slate-800">{orcamento.validity} dias</span>
                 </p>
              </div>
              <div className="mt-10">
                 <p className="text-xl font-bold text-slate-900 underline decoration-blue-500 decoration-4 underline-offset-8">
                    {orcamento.user.companyName || orcamento.user.name}
                 </p>
                 <p className="text-sm text-slate-500 mt-6 italic bg-slate-50 inline-block px-4 py-2 rounded-lg border border-slate-100">
                    "{orcamento.user.signature || "Obrigado pela preferência!"}"
                 </p>
              </div>
           </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto mt-8 text-center text-slate-400 text-xs print:hidden pb-10">
        <p>Documento gerado digitalmente em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
        <p className="mt-1 font-bold text-blue-600/50">Powered by Fechou-AI</p>
      </footer>
    </div>
  );
}