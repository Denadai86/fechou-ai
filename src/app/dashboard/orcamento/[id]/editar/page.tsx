import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { EditForm } from "./EditForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarOrcamentoPage({ params }: PageProps) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Busca os dados atuais para preencher o formulário
  const orcamento = await prisma.proposal.findUnique({
    where: { id, userId },
    include: { 
      items: { 
        // CORREÇÃO: Trocamos 'createdAt' por 'id' ou removemos o orderBy
        // O id (CUID) já mantém uma ordem cronológica aproximada
        orderBy: { id: 'asc' } 
      } 
    }
  });

  if (!orcamento) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-slate-900">Editar Orçamento</h1>
        {/* Passamos os dados iniciais para o formulário cliente */}
        <EditForm initialData={orcamento} />
      </div>
    </div>
  );
}