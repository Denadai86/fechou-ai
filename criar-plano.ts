// criar-plano.ts
import { MercadoPagoConfig, PreApprovalPlan } from 'mercadopago';

// 1. Configure com seu Access Token de Produção
const client = new MercadoPagoConfig({ 
  accessToken: 'APP_USR-6793679952796625-010713-bcbaf7bb34f95e6bcbe35d195278a10e-314151827'
  //APP_USR-6793679952796625-010713-bcbaf7bb34f95e6bcbe35d195278a10e-314151827
});

const planClient = new PreApprovalPlan(client);

async function create() {
  console.log("⏳ Criando plano no Mercado Pago...");

  try {
    const plan = await planClient.create({
      body: {
        reason: "Fechou-AI Plano PRO", // Nome que aparece na fatura
        auto_recurring: {
          frequency: 1,
          frequency_type: "months", // Cobrança Mensal
          transaction_amount: 29.90, // Valor R$ 29,90
          currency_id: "BRL" // Moeda Real
        },
        back_url: "https://fechou-ai.acaoleve.com/dashboard", // Para onde o user volta
        status: "active"
      }
    });

    console.log("✅ SUCESSO! PLANO CRIADO.");
    console.log("Copie o ID abaixo e coloque no seu .env como MP_PLAN_ID:");
    console.log("-------------------------------------------------------");
    console.log(plan.id); 
    console.log("-------------------------------------------------------");

  } catch (error) {
    console.error("❌ Erro ao criar plano:", error);
  }
}

create();