// src/app/p/[publicId]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Wallet, Calendar, ShieldCheck } from "lucide-react";
import { Metadata } from "next";
import { AprovarButton } from "@/components/AprovarButton";
import { PixPayment } from "@/components/PixPayment";
import { PixPayload } from "@/lib/pix";

interface PageProps {
  params: Promise<{ slug: string }>; // Alterado de publicId para slug
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Busca flexível: tenta por slug, se não achar tenta por publicId (legado)
  const orcamento = await prisma.proposal.findFirst({
    where: { 
      OR: [
        { slug: slug },
        { publicId: slug }
      ]
    },
    include: { user: true }
  });

  if (!orcamento) return { title: "Orçamento não encontrado" };

  const empresa = orcamento.user.companyName || orcamento.user.name;
  const valor = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(orcamento.totalAmount));
  const logoParaPreview = orcamento.user.logoUrl || "";

  return {
    title: `Orçamento: ${orcamento.title} - ${empresa}`,
    description: `Proposta no valor de ${valor}. Clique para conferir os detalhes.`,
    openGraph: {
      title: `📄 Orçamento de ${empresa}`,
      description: `Serviço: ${orcamento.title}\nValor: ${valor}`,
      images: logoParaPreview ? [{ url: logoParaPreview, width: 400, height: 400 }] : [],
    },
  };
}

export default async function PublicProposalPage({ params }: PageProps) {
  const { slug } = await params;

  const orcamento = await prisma.proposal.findFirst({
    where: { 
      OR: [
        { slug: slug },
        { publicId: slug }
      ]
    },
    include: { items: true, user: true }
  });

  if (!orcamento) return notFound();

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const whatsappLink = `https://wa.me/55${orcamento.user.phone?.replace(/\D/g, '')}?text=Olá! Aceito o orçamento de ${orcamento.title} no valor de ${formatMoney(Number(orcamento.totalAmount))}. Vamos fechar?`;

  let pixPayload = null;
  if (orcamento.user.pixKey) {
    try {
        const cidade = orcamento.user.address ? orcamento.user.address.split(',').pop()?.trim() || "Brasil" : "Brasil";
        const pixGenerator = new PixPayload(
            orcamento.user.pixKey,
            orcamento.user.companyName || orcamento.user.name || "Prestador",
            cidade.slice(0, 15),
            Number(orcamento.totalAmount),
            orcamento.id.slice(-10)
        );
        pixPayload = pixGenerator.getPayload();
    } catch (e) {
        console.error("Erro ao gerar PIX:", e);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      <header className="bg-white border-b border-slate-200 py-8 px-4 text-center">
        {orcamento.user.logoUrl && (
            <img src={orcamento.user.logoUrl} alt="Logo" className="h-16 w-auto mx-auto mb-4 object-contain" />
        )}
        <h1 className="text-xl font-black text-slate-900 uppercase tracking-widest">
          {orcamento.user.companyName || orcamento.user.name}
        </h1>
        {orcamento.user.address && <p className="text-sm text-slate-500 mt-1">{orcamento.user.address}</p>}
      </header>

      <main className="max-w-2xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-slate-900 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Valor Total</p>
            <h2 className="text-5xl font-black relative z-10">{formatMoney(Number(orcamento.totalAmount))}</h2>
          </div>

          <div className="p-8">
            <h3 className="text-2xl font-bold mb-4">{orcamento.title}</h3>
            <p className="text-slate-600 mb-8 whitespace-pre-line leading-relaxed italic">
              {orcamento.description}
            </p>

            <div className="space-y-4 mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2">
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Descrição</p>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Valor</p>
              </div>
              {orcamento.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start py-2 border-b border-slate-200/50 last:border-0">
                  <div className="pr-4">
                    <span className="text-slate-700 font-medium block">{item.description}</span>
                    {item.quantity > 1 && <span className="text-xs text-slate-400">Qtd: {item.quantity} x {formatMoney(Number(item.unitPrice))}</span>}
                  </div>
                  <span className="font-bold text-slate-900 whitespace-nowrap">{formatMoney(Number(item.totalPrice))}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6">
                {pixPayload && <PixPayment pixCode={pixPayload} />}
                <AprovarButton publicId={orcamento.publicId} whatsappLink={whatsappLink} />
            </div>
          </div>

          <div className="bg-slate-50 p-8 border-t border-slate-100 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-slate-600">
              <Wallet className="text-blue-600" size={20} />
              <div className="text-sm">
                <p className="font-bold text-slate-800">Dados Bancários / PIX</p>
                <p className="font-mono text-slate-600 break-all">{orcamento.user.pixKey || "Consulte via WhatsApp"}</p>
                {orcamento.user.pixHolder && <p className="text-xs text-slate-400">Titular: {orcamento.user.pixHolder}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Calendar className="text-blue-600" size={20} />
              <p className="text-sm">Válido por {orcamento.validity} dias</p>
            </div>
          </div>
        </div>
        <p className="mt-8 mb-10 text-center text-slate-400 text-xs flex items-center justify-center gap-1 uppercase tracking-tighter">
          Gerado via <span className="font-bold text-slate-600">Fechou-AI</span>
        </p>
      </main>
    </div>
  );
}