import { NextRequest, NextResponse } from "next/server";
// Importando a SDK NOVA (V2)
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// Inicialização da SDK Nova
const googleAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // 1. Autenticação
    const user = await currentUser(); 
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    await prisma.user.upsert({
      where: { id: user.id },
      update: {}, 
      create: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Usuário Novo",
      }
    });

    // 2. Recebendo Dados
    const formData = await req.formData();
    const file = formData.get("audio") as File | null;
    const textPrompt = formData.get("text") as string | null;

    if (!file && !textPrompt) return NextResponse.json({ error: "Sem dados." }, { status: 400 });

    // 3. System Instruction
    const systemInstructionText = `
      Você é um especialista comercial do 'Fechou-AI'.
      
      REGRAS DE NEGÓCIO:
      1. Título técnico e persuasivo.
      2. Descrição formal: "Prezado cliente, conforme solicitado..."
      3. Identifique QUANTIDADES e PREÇOS UNITÁRIOS.
      4. Se omitido, estime valor de mercado e use "(Est.)".
      5. Mencione 5% de desconto à vista nas observações.
      
      IMPORTANTE SOBRE NÚMEROS:
      No JSON, campos "preco_unitario", "subtotal" e "total" devem ser NÚMEROS ou STRINGS NUMÉRICAS PURAS (ex: 150.50).
      NUNCA inclua "R$", pontos de milhar ou vírgulas. Use ponto para decimal.

      SAÍDA SOMENTE JSON:
      {
        "titulo": "String",
        "descricao": "String",
        "itens": [
          { 
            "nome": "String", 
            "descricao_curta": "String",
            "quantidade": Number, 
            "preco_unitario": Number,
            "subtotal": Number 
          }
        ],
        "total": Number,
        "observacoes_pagamento": "String",
        "prazo": "String"
      }
    `;

    // 4. Preparando Conteúdo
    // Na SDK nova, o formato de 'contents' é um pouco mais estrito
    let userContentParts: any[] = [];
    
    if (textPrompt) {
        userContentParts.push({ text: `INPUT DO USUÁRIO: ${textPrompt}` });
    }
    
    if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString("base64");
        userContentParts.push({ 
          inlineData: { mimeType: file.type || "audio/mp3", data: base64Audio } 
        });
    }

    // 5. Chamada à IA com Fallback (Sintaxe da SDK Nova)
    let result;
    
    // Configuração comum para ambas as chamadas
    const commonConfig = {
      responseMimeType: 'application/json',
      systemInstruction: { parts: [{ text: systemInstructionText }] },
    };

    try {
      // TENTATIVA 1: GEMINI 2.0 FLASH (Sintaxe Nova)
      // Não existe getGenerativeModel, chamamos direto models.generateContent
      result = await googleAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: userContentParts }],
        config: commonConfig
      });

    } catch (error) {
      console.warn("Flash falhou, tentando Pro...", error);
      
      // TENTATIVA 2: GEMINI 2.0 PRO (Fallback)
      result = await googleAI.models.generateContent({
        model: "gemini-2.0-pro-exp-02-05", // Versão experimental atual do Pro
        contents: [{ role: "user", parts: userContentParts }],
        config: commonConfig
      });
    }

    // 6. Processamento (Sintaxe Nova)
    // Na SDK nova, o texto costuma vir direto em result.text()
    const jsonText = result.text;
    
    if (!jsonText) throw new Error("A IA não retornou conteúdo.");

    const cleanJson = jsonText.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    // 7. Blindagem Numérica
    const parseCurrency = (val: any) => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const cleaned = val.replace(/[^\d.,]/g, '').replace(',', '.');
        return parseFloat(cleaned) || 0;
      }
      return 0;
    };

    const cleanTotal = parseCurrency(data.total);

    // 8. Salvamento
    const savedProposal = await prisma.proposal.create({
      data: {
        userId: user.id, 
        title: data.titulo || "Orçamento Profissional",
        description: `${data.descricao}\n\n${data.observacoes_pagamento || ''}`,
        totalAmount: cleanTotal,
        validity: 15,
        items: {
          create: data.itens?.map((item: any) => {
            const unitP = parseCurrency(item.preco_unitario);
            const qty = Number(item.quantidade) || 1;
            return {
              description: item.nome + (item.descricao_curta ? ` - ${item.descricao_curta}` : ""),
              quantity: qty,
              unitPrice: unitP,
              totalPrice: qty * unitP,
              type: "SERVICE"
            };
          }) || []
        }
      }
    });

    return NextResponse.json({ success: true, id: savedProposal.id });

  } catch (error) {
    console.error("Erro crítico na API:", error);
    return NextResponse.json({ error: "Erro interno ao processar inteligência." }, { status: 500 });
  }
}