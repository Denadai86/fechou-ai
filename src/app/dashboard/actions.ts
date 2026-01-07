// src/app/dashboard/actions.ts

"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server"; // Importe o currentUser
import { revalidatePath } from "next/cache";
import { ProposalStatus } from "@prisma/client";
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import { redirect } from 'next/navigation';

export async function criarCheckoutAssinatura() {
  const { userId } = await auth();
  const user = await currentUser(); // <--- Usamos isso para pegar o email
  
  if (!userId) return;

  const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
  const subscription = new PreApproval(client);

  try {
    const response = await subscription.create({
      body: {
        reason: "Fechou-AI PRO (Mensal)",
        external_reference: userId, // VINCULA O PAGAMENTO AO USUÁRIO
        payer_email: user?.emailAddresses[0]?.emailAddress, // Agora o email existe
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 29.90,
          currency_id: "BRL"
        },
        back_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        status: "pending",
        preapproval_plan_id: process.env.MP_PLAN_ID! 
      }
    });

    if (response.init_point) {
       redirect(response.init_point);
    }
  } catch (error) {
    console.error("Erro MP:", error);
    throw new Error("Falha ao iniciar pagamento");
  }
}

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

  revalidatePath("/dashboard");
}