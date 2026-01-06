import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function NovoOrcamentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) redirect("/sign-in");

  // Verifica se o usuário existe e tem os dados mínimos
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // A Lógica da Trava:
  // Se o usuário não existe NO BANCO LOCAL,
  // OU se ele existe mas não preencheu o telefone (campo obrigatório do orçamento)
  if (!user || !user.phone) {
    redirect("/dashboard/perfil?msg=complete_cadastro");
  }

  return <>{children}</>;
}