import { prisma } from "@/lib/prisma";
import { Plan } from "@prisma/client";
import { startOfMonth, endOfMonth } from "date-fns";

export const MAX_FREE_ORCAMENTOS = 3;

export async function checkUserLimit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, customMonthlyLimit: true }
  });

  if (!user) return false;

  // 1. Se for PRO, libera geral
  if (user.plan === "PRO") return true;

  // 2. Define o limite (Padrão ou Customizado)
  const limit = user.customMonthlyLimit ?? MAX_FREE_ORCAMENTOS;

  // 3. Conta quantos orçamentos foram criados NESTE MÊS
  const now = new Date();
  const count = await prisma.proposal.count({
    where: {
      userId,
      createdAt: {
        gte: startOfMonth(now),
        lte: endOfMonth(now),
      }
    }
  });

  // 4. Retorna TRUE se ainda tiver saldo, FALSE se estourou
  return count < limit;
}

export async function getUserUsage(userId: string) {
  const now = new Date();
  const count = await prisma.proposal.count({
    where: {
      userId,
      createdAt: {
        gte: startOfMonth(now),
        lte: endOfMonth(now),
      }
    }
  });
  
  return count;
}
