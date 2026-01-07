"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
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
  const logoUrl = formData.get("logoUrl") as string; // <--- AQUI

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
      logoUrl, // <--- AQUI
    },
    create: {
      id: userId,
      email: "", // O Clerk preenche no primeiro acesso via API
      companyName,
      cpfCnpj,
      address,
      phone,
      pixKey,
      pixHolder,
      signature,
      logoUrl, // <--- AQUI
    },
  });

  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard");
}