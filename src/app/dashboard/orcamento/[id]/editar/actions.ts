"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Definindo a estrutura dos dados que vamos receber do formulário
interface EditProposalState {
  proposalId: string;
  title: string;
  description: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export async function updateProposal(data: EditProposalState) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  // 1. Segurança: Verifica se o orçamento pertence mesmo ao usuário
  const existingProposal = await prisma.proposal.findUnique({
    where: { id: data.proposalId, userId },
  });

  if (!existingProposal) throw new Error("Orçamento não encontrado ou permissão negada.");

  // 2. Recalcula o valor total baseado nos novos itens
  const newTotal = data.items.reduce((acc, item) => {
    return acc + (item.quantity * item.unitPrice);
  }, 0);

  // 3. A TRANSAÇÃO MÁGICA (Tudo ou nada)
  await prisma.$transaction(async (tx) => {
    // A. Atualiza dados principais
    await tx.proposal.update({
      where: { id: data.proposalId },
      data: {
        title: data.title,
        description: data.description,
        totalAmount: newTotal,
      },
    });

    // B. Limpa os itens antigos
    await tx.proposalItem.deleteMany({
      where: { proposalId: data.proposalId },
    });

    // C. Cria os itens novos corrigidos
    if (data.items.length > 0) {
      await tx.proposalItem.createMany({
        data: data.items.map((item) => ({
          proposalId: data.proposalId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice, // Recalcula o subtotal
          type: "SERVICE",
        })),
      });
    }
  });

  // 4. Redireciona de volta para a tela de visualização
  revalidatePath(`/dashboard/orcamento/${data.proposalId}`);
  revalidatePath(`/p/${existingProposal.publicId}`);
  redirect(`/dashboard/orcamento/${data.proposalId}`);
}