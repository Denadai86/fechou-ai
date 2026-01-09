//src/app/dashboard/perfil/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { MercadoPagoConfig, PreApproval } from 'mercadopago';


export async function salvarPerfil(formData: FormData) {
  // 1. Autenticação completa (ID + Dados do User para pegar o email)
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Não autorizado");

  // Garante que pegamos o e-mail correto do Clerk
  const emailAtual = user.emailAddresses[0]?.emailAddress;
  if (!emailAtual) throw new Error("E-mail não encontrado no login.");

  // 2. CORREÇÃO DO ERRO DE UNIQUE EMAIL (O "Matador de Zumbis")
  // Verifica se existe algum usuário no banco com esse mesmo e-mail, mas com ID diferente.
  // Isso acontece quando você deleta o user no Clerk e cria de novo, mas o banco manteve o velho.
  const usuarioFantasma = await prisma.user.findUnique({
    where: { email: emailAtual }
  });

  if (usuarioFantasma && usuarioFantasma.id !== userId) {
    console.log(`💀 Conflito detectado. Removendo usuário antigo: ${usuarioFantasma.id}`);
    await prisma.user.delete({
      where: { id: usuarioFantasma.id }
    });
  }

  // 3. Extração dos dados do formulário
  const companyName = formData.get("companyName") as string;
  const cpfCnpj = formData.get("cpfCnpj") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const pixKey = formData.get("pixKey") as string;
  const pixHolder = formData.get("pixHolder") as string;
  const signature = formData.get("signature") as string;
  const logoUrl = formData.get("logoUrl") as string;

  // 4. Salva ou Atualiza (Agora seguro contra duplicidade)
  await prisma.user.upsert({
    where: { id: userId },
    update: {
      companyName,
      cpfCnpj,
      address,
      phone,
      pixKey,
      pixHolder,
      signature,
      logoUrl,
      email: emailAtual, // Garante que o email no banco esteja sincronizado
    },
    create: {
      id: userId,
      email: emailAtual, // Usa o email real, nunca vazio
      name: `${user.firstName} ${user.lastName || ""}`.trim(),
      companyName,
      cpfCnpj,
      address,
      phone,
      pixKey,
      pixHolder,
      signature,
      logoUrl,
    },
  });

  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard");
  return { success: true };
}

// --- FUNÇÃO PARA EXCLUIR CONTA (MANTIDA E REVISADA) ---
export async function excluirConta() {
    const { userId } = await auth();
    if (!userId) throw new Error("Não autorizado");
  
    try {
        // 1. Verificar se o usuário existe no nosso banco antes de deletar
        // Isso evita erro se o usuário já tiver sido deletado manualmente
        const userExists = await prisma.user.findUnique({
            where: { id: userId }
        });

        // 2. Se o usuário existe no banco local, deleta
        if (userExists) {
            await prisma.user.delete({
                where: { id: userId }
            });
        }
  
        // 3. Deletar do Clerk (Sistema de Autenticação)
        try {
            const client = await clerkClient();
            await client.users.deleteUser(userId);
        } catch (clerkError) {
            console.error("Erro ao deletar no Clerk (pode já ter sido removido):", clerkError);
        }
  
        return { success: true };
    } catch (error) {
        console.error("Erro crítico ao excluir conta:", error);
        throw new Error("Falha ao remover os dados. Tente novamente.");
    }


}

export async function buscarDadosAssinatura() {
  const { userId } = await auth();
  if (!userId) return null;

  const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
  const preApproval = new PreApproval(client);

  try {
    // No SDK v2, passamos os critérios de busca diretamente no objeto de opções
    const search = await preApproval.search({
      options: {
        external_reference: userId,
      }
    });

    // Pegamos a assinatura mais recente (index 0)
    const assinatura = search.results?.[0];
    
    if (!assinatura) return null;

    return {
      id: assinatura.id,
      status: assinatura.status, // authorized, paused, cancelled, pending
      proximoPagamento: assinatura.next_payment_date,
      valor: assinatura.auto_recurring?.transaction_amount,
      linkPagamento: assinatura.init_point
    };
  } catch (error) {
    console.error("Erro ao buscar assinatura no MP:", error);
    return null;
  }
}

export async function cancelarAssinatura(idAssinatura: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
  const preApproval = new PreApproval(client);

  try {
    // No Mercado Pago, cancelamos atualizando o status para 'cancelled'
    await preApproval.update({
      id: idAssinatura,
      body: { status: "cancelled" }
    });

    // Atualiza nosso banco para refletir o cancelamento imediatamente
    await prisma.user.update({
      where: { id: userId },
      data: { plan: "FREE", subscriptionStatus: "cancelled" }
    });

    revalidatePath("/dashboard/perfil");
    return { success: true };
  } catch (error) {
    console.error("Erro ao cancelar no MP:", error);
    throw new Error("Falha ao cancelar assinatura.");
  }
}