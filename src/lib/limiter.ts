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

export async function getPlanUsage(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, customMonthlyLimit: true }
  });

  if (!user) return { isPro: false, usage: 0, limit: 0, remaining: 0 };

  if (user.plan === "PRO") {
    return { isPro: true, usage: 0, limit: 0, remaining: 999 };
  }

  const limit = user.customMonthlyLimit ?? MAX_FREE_ORCAMENTOS;
  const now = new Date();

  const usage = await prisma.proposal.count({
    where: {
      userId,
      createdAt: {
        gte: startOfMonth(now),
        lte: endOfMonth(now),
      }
    }
  });

  return {
    isPro: false,
    usage,
    limit,
    remaining: Math.max(0, limit - usage)
  };
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
