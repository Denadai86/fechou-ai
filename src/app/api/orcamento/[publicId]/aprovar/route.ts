import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
// Agora que rodamos o db push, essa importação vai funcionar:
import { ProposalStatus } from "@prisma/client"; 

export async function POST(
  req: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;

  try {
    await prisma.proposal.update({
      where: { publicId },
      data: { 
        status: ProposalStatus.APROVADO 
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao aprovar:", error);
    return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 });
  }
}