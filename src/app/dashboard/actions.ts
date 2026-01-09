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

  // 1. Criamos uma variável para guardar a URL fora do bloco try
  let checkoutUrl: string | undefined;

  try {
    const response = await subscription.create({
      body: {
        reason: "Assinatura Fechou-AI PRO",
        external_reference: userId,
        payer_email: emailUser,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 29.90,
          currency_id: "BRL"
        },
        // Certifique-se que essa URL no .env NÃO termina com /
        back_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      }
    });

    if (response.init_point) {
      checkoutUrl = response.init_point;
    } else {
      console.error("Resposta sem init_point:", response);
    }

  } catch (error: any) {
    // Aqui capturamos erros REAIS da API
    console.error("❌ Erro na API do Mercado Pago:", error);
    // Não damos throw aqui para não travar o Next.js, 
    // apenas retornamos um erro para o componente tratar se quiser
  }

  // 2. O REDIRECT PRECISA ESTAR FORA DO TRY/CATCH
  if (checkoutUrl) {
    redirect(checkoutUrl);
  }

  // 3. Se chegou aqui, algo deu errado e não redirecionou
  throw new Error("Não foi possível gerar o link de pagamento. Tente novamente.");
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