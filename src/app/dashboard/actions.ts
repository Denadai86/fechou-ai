// src/app/dashboard/actions.ts

"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server"; 
import { revalidatePath } from "next/cache";
import { ProposalStatus } from "@prisma/client";
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import { redirect } from 'next/navigation';

export async function criarCheckoutAssinatura() {
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId || !user) throw new Error("Usuário não identificado.");
  if (!process.env.MP_ACCESS_TOKEN) throw new Error("Token MP ausente.");

  const emailUser = user.emailAddresses[0]?.emailAddress;
  
  const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
  const subscription = new PreApproval(client);

  let urlParaRedirecionar = "";

  try {
    console.log("🚀 Gerando Link de Assinatura...");

    const response = await subscription.create({
      body: {
        reason: "Assinatura Fechou-AI PRO",
        external_reference: userId,
        payer_email: emailUser, // Pode voltar para o email real agora
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 29.90,
          currency_id: "BRL"
        },
        // Volta para a variável de ambiente (URL Real)
        back_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      }
    });

    console.log("✅ Resposta MP:", response.init_point);

    if (response.init_point) {
       // Guardamos a URL para usar FORA do try/catch
       urlParaRedirecionar = response.init_point;
    } else {
       throw new Error("O Mercado Pago não devolveu o link.");
    }

  } catch (error: any) {
    console.error("❌ Erro MP:", JSON.stringify(error, null, 2));
    const msg = error.message || "Falha ao criar assinatura.";
    throw new Error(`Erro MP: ${msg}`);
  }

  // AQUI É O LUGAR CERTO DO REDIRECT
  // O Next.js precisa que isso aconteça fora do bloco try/catch
  if (urlParaRedirecionar) {
      redirect(urlParaRedirecionar);
  }
}



// ... (Mantenha as funções deleteProposal e updateProposalStatus iguais)
export async function deleteProposal(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

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