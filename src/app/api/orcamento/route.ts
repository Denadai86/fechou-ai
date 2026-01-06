// src/app/api/orcamento/route.ts

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server"; // ✅ Removido o 'auth' que não estava sendo usado

const googleAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // 1. Autenticação COMPLETA
    const user = await currentUser(); 
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // --- CORREÇÃO DO ERRO P2003 (Blindagem) ---
    // Garante que o User existe no banco local antes de salvar o orçamento
    await prisma.user.upsert({
      where: { id: user.id },
      update: {}, 
      create: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Usuário Novo",
      }
    });

    const formData = await req.formData();
    const file = formData.get("audio") as File | null;
    const textPrompt = formData.get("text") as string | null;

    if (!file && !textPrompt) {
      return NextResponse.json({ error: "Sem dados de entrada." }, { status: 400 });
    }

    // 2. Preparação do Prompt para o Gemini
    let contents = [];
    const systemInstruction = `
      Você é a IA do 'Fechou-AI', especialista em orçamentos.
      Analise o áudio/texto e gere um JSON estruturado.
      Se faltar valor, estime e marque com '(Estimado)'.
      SAÍDA JSON OBRIGATÓRIA: { titulo, descricao, itens: [{nome, valor}], total, prazo }.
    `;
    
    // Adiciona instrução do sistema junto com o input do usuário
    let userMessage = systemInstruction;
    if (textPrompt) userMessage += `\n\nDetalhes adicionais: ${textPrompt}`;
    contents.push({ text: userMessage });
    
    if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString("base64");
        contents.push({
            inlineData: { mimeType: file.type || "audio/mp3", data: base64Audio }
        });
    }

    // 3. Chamada à API
    const result = await googleAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: contents,
        config: { 
            responseMimeType: 'application/json',
            // Opcional: Você pode reativar o responseSchema aqui para forçar a estrutura
        } 
    });

    // ⚠️ CORREÇÃO CRÍTICA AQUI:
    // .text() é uma função, precisa dos parênteses.
    // Se result for nulo, evitamos o crash.
    const jsonText = result?.text ? result.text : null;

    if (!jsonText) {
        throw new Error("A IA não retornou texto.");
    }

    const data = JSON.parse(jsonText);

    // 4. SALVAMENTO NO BANCO
    const savedProposal = await prisma.proposal.create({
      data: {
        userId: user.id, 
        title: data.titulo || "Orçamento Gerado",
        description: data.descricao || "",
        totalAmount: data.total || 0,
        validity: 15,
        items: {
          create: data.itens?.map((item: any) => ({
            description: item.nome || "Item",
            unitPrice: item.valor || 0,
            totalPrice: item.valor || 0,
            quantity: 1,
            type: "SERVICE"
          })) || []
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      id: savedProposal.id,
      publicId: savedProposal.publicId
    });

  } catch (error) {
    console.error("Erro API:", error);
    return NextResponse.json({ error: "Erro interno ao processar orçamento." }, { status: 500 });
  }
}