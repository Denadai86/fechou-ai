//src/app/dashboard/perfil/actions.ts

"use server";

import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function salvarPerfil(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const companyName = formData.get("companyName") as string;
  const cpfCnpj = formData.get("cpfCnpj") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const pixKey = formData.get("pixKey") as string;
  const pixHolder = formData.get("pixHolder") as string;
  const signature = formData.get("signature") as string;
  const logoUrl = formData.get("logoUrl") as string;

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
    },
    create: {
      id: userId,
      email: "", 
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
}

// --- NOVA FUNÇÃO PARA EXCLUIR CONTA ---
export async function excluirConta() {
    const { userId } = await auth();
    if (!userId) throw new Error("Não autorizado");
  
    try {
        // 1. Verificar se o usuário existe no nosso banco antes de deletar
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
        // Fazemos isso por último para garantir que se o banco falhar, 
        // o usuário ainda consiga tentar excluir novamente.
        try {
            const client = await clerkClient();
            await client.users.deleteUser(userId);
        } catch (clerkError) {
            console.error("Erro ao deletar no Clerk:", clerkError);
            // Se o usuário não existir no Clerk, ignoramos e seguimos
        }
  
        return { success: true };
    } catch (error) {
        console.error("Erro crítico ao excluir conta:", error);
        throw new Error("Falha ao remover os dados. O registro pode já ter sido excluído.");
    }
}