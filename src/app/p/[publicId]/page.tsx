// src/app/p/[publicId]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CheckCircle2, Wallet, Calendar } from "lucide-react";
import { Metadata } from "next";
import { AprovarButton } from "@/components/AprovarButton";

interface PageProps {
  params: Promise<{ publicId: string }>;
}

// --- SEO DINÂMICO PARA WHATSAPP (VERSÃO PREMIUM COM LOGO) ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { publicId } = await params;
  
  const orcamento = await prisma.proposal.findUnique({
    where: { publicId },
    include: { user: true }
  });

  if (!orcamento) return { title: "Orçamento não encontrado" };

  const empresa = orcamento.user.companyName || orcamento.user.name;
  const valor = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(orcamento.totalAmount));
  
  // Se não houver logo, podemos usar um fallback ou deixar vazio
  const logoParaPreview = orcamento.user.logoUrl || "";

  return {
    title: `Orçamento: ${orcamento.title} - ${empresa}`,
    description: `Proposta no valor de ${valor}. Clique para conferir os detalhes de ${empresa}.`,
    openGraph: {
      title: `📄 Orçamento de ${empresa}`,
      description: `Serviço: ${orcamento.title}\nValor: ${valor}`,
      type: "website",
      images: logoParaPreview ? [
        {
          url: logoParaPreview,
          width: 400,
          height: 400,
          alt: `Logo ${empresa}`,
        }
      ] : [],
    },
    // Algumas redes como o Twitter/X preferem esse formato:
    twitter: {
      card: "summary_large_image",
      title: `Orçamento: ${orcamento.title}`,
      description: `Valor: ${valor}`,
      images: logoParaPreview ? [logoParaPreview] : [],
    }
  };
}

// --- 2. PÁGINA PÚBLICA (CORRIGIDA) ---
export default async function PublicProposalPage({ params }: PageProps) {
  // CORREÇÃO CRÍTICA: Aguardar o params no Next.js 16
  const { publicId } = await params;

  const orcamento = await prisma.proposal.findUnique({
    where: { publicId: publicId },
    include: { items: true, user: true }
  });

  if (!orcamento) return notFound();

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Link direto para o WhatsApp do profissional
  const whatsappLink = `https://wa.me/55${orcamento.user.phone?.replace(/\D/g, '')}?text=Olá! Aceito o orçamento de ${orcamento.title} no valor de ${formatMoney(Number(orcamento.totalAmount))}. Vamos fechar?`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      <header className="bg-white border-b border-slate-200 py-6 px-4 text-center">
        <h1 className="text-xl font-bold text-slate-800 uppercase tracking-widest">
          {orcamento.user.companyName || orcamento.user.name}
        </h1>
      </header>

      <main className="max-w-2xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          
          <div className="bg-blue-600 p-8 text-white text-center">
            <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-2">Valor do Orçamento</p>
            <h2 className="text-5xl font-black">{formatMoney(Number(orcamento.totalAmount))}</h2>
          </div>

          <div className="p-8">
            <h3 className="text-2xl font-bold mb-4">{orcamento.title}</h3>
            <p className="text-slate-600 mb-8 whitespace-pre-line leading-relaxed">
              {orcamento.description}
            </p>

            <div className="space-y-4 mb-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Itens do Serviço</p>
              {orcamento.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-700">{item.description}</span>
                  <span className="font-bold text-slate-900">{formatMoney(Number(item.unitPrice))}</span>
                </div>
              ))}
            </div>

            <AprovarButton publicId={orcamento.publicId} whatsappLink={whatsappLink} />
          </div>

          <div className="bg-slate-50 p-8 border-t border-slate-100 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-slate-600">
              <Wallet className="text-blue-600" size={20} />
              <div className="text-sm">
                <p className="font-bold text-slate-800">Forma de Pagamento</p>
                <p>PIX: {orcamento.user.pixKey}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Calendar className="text-blue-600" size={20} />
              <p className="text-sm">Proposta válida por {orcamento.validity} dias</p>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-slate-400 text-xs flex items-center justify-center gap-1">
          Criado profissionalmente com <span className="font-bold text-blue-600">Fechou-AI</span>
        </p>
      </main>
    </div>
  );
}