"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export async function salvarPerfil(formData: FormData) {
  // Segurança: Pegamos o ID direto do Clerk no servidor, não confiamos no form
  const user = await currentUser();
  if (!user) throw new Error("Usuário não autenticado");

  const data = {
    // Identidade
    companyName: formData.get("companyName") as string,
    cpfCnpj: formData.get("cpfCnpj") as string,
    
    // Contato
    address: formData.get("address") as string,
    phone: formData.get("phone") as string,
    
    // Financeiro
    pixKey: formData.get("pixKey") as string,
    pixHolder: formData.get("pixHolder") as string,
    bankDetails: formData.get("bankDetails") as string,
    
    // Config
    signature: formData.get("signature") as string,
    themeColor: formData.get("themeColor") as string || "#2563EB",
  };

  // Upsert: Cria se não existe, Atualiza se já existe
  await prisma.user.upsert({
    where: { id: user.id },
    update: data,
    create: {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName ? `${user.firstName} ${user.lastName || ""}` : "",
      ...data
    }
  });

  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard/novo"); // Para atualizar o orçamento com os novos dados
}