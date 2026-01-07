//src/app/api/webhooks/mercadopago/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, PreApproval } from "mercadopago";

// Inicializa o cliente para conferir o status real no MP
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
const subscription = new PreApproval(client);

export async function POST(req: NextRequest) {
  try {
    // 1. O MP manda os dados na query ou no body
    const body = await req.json();
    const { type, data } = body;

    // Só nos interessa avisos de ASSINATURA (preapproval)
    if (type === "subscription_preapproval") {
      const subscriptionId = data.id;

      // 2. Vamos perguntar pro MP: "Qual o status real dessa assinatura?"
      // (Não confiamos apenas no que veio no body por segurança)
      const subData = await subscription.get({ id: subscriptionId });
      
      const status = subData.status; // authorized, paused, cancelled
      const userId = subData.external_reference; // Lembra que mandamos o userId aqui?

      if (!userId) {
        return NextResponse.json({ error: "Sem userId vinculado" }, { status: 400 });
      }

      console.log(`🔔 Webhook MP: Assinatura ${subscriptionId} está ${status} para User ${userId}`);

      // 3. Atualiza o Banco de Dados
      if (status === "authorized") {
        // PAGOU: Libera acesso PRO
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "PRO",
            subscriptionId: subscriptionId,
            subscriptionStatus: status,
            // Adiciona 30 dias de validade a partir de agora
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        });
      } else if (status === "cancelled" || status === "paused") {
        // CANCELOU/FALHOU: Volta para FREE
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "FREE",
            subscriptionStatus: status
          }
        });
      }
    }

    // O MP exige que retornemos status 200 para parar de mandar o aviso
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("Erro no Webhook:", error);
    // Retornamos 200 mesmo com erro interno para não travar a fila do MP
    return NextResponse.json({ received: true }, { status: 200 });
  }
}