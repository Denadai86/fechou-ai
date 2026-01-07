"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ProposalStatus } from "@prisma/client";


export async function deleteProposal(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  // Deleta primeiro os itens (por causa da chave estrangeira) e depois a proposta
  await prisma.$transaction([
    prisma.proposalItem.deleteMany({ where: { proposalId: id } }),
    prisma.proposal.delete({ where: { id, userId } })
  ]);

  revalidatePath("/dashboard");
}

export async function updateProposalStatus(id: string, status: ProposalStatus) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  await prisma.proposal.update({
    where: { id, userId },
    data: { status }
  });

  // Atualiza a tela instantaneamente
  revalidatePath("/dashboard");
}