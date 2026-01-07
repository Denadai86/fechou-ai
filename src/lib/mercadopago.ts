import { MercadoPagoConfig, PreApproval } from 'mercadopago';

// Inicializa o cliente com seu token
export const mpClient = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

// Exporta a API de Assinaturas (PreApproval)
export const subscriptionClient = new PreApproval(mpClient);