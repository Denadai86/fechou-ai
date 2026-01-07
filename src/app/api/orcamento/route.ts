// src/app/api/orcamento/route.ts

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { checkUserLimit } from "@/lib/limiter"; 

// Inicializa a SDK
const googleAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // 1. Autenticação
    const user = await currentUser(); 
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    // 2. BLOQUEIO DE PLANO (O Paywall)
    // Verificamos o limite ANTES de gastar processamento com a IA
    const canCreate = await checkUserLimit(user.id);
    
    // Se estourou o limite e não é PRO, barra aqui.
    if (!canCreate) {
      return NextResponse.json({ 
        error: "Limite atingido. Faça upgrade para o plano PRO." 
      }, { status: 403 }); 
    }

    // 3. Garante que o usuário existe no Banco Local
    await prisma.user.upsert({
      where: { id: user.id },
      update: {}, 
      create: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Usuário Novo",
      }
    });

    // 4. Recebimento dos Dados (Áudio/Texto)
    const formData = await req.formData();
    const file = formData.get("audio") as File | null;
    const textPrompt = formData.get("text") as string | null;

    if (!file && !textPrompt) return NextResponse.json({ error: "Sem dados." }, { status: 400 });

    // 5. Engenharia de Prompt (System Instruction)
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

    // 6. Preparando Conteúdo para o Gemini
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

    // Configuração Comum
    const commonConfig = {
      responseMimeType: 'application/json',
      systemInstruction: { parts: [{ text: systemInstructionText }] },
    };

    let result;
    try {
      // TENTATIVA 1: GEMINI 2.0 FLASH (Mais rápido e barato)
      result = await googleAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: userContentParts }],
        config: commonConfig
      });

    } catch (error) {
      console.warn("Flash falhou, tentando Pro...", error);
      
      // TENTATIVA 2: GEMINI 2.0 PRO (Fallback mais inteligente)
      result = await googleAI.models.generateContent({
        model: "gemini-2.5-pro", 
        contents: [{ role: "user", parts: userContentParts }],
        config: commonConfig
      });
    }

    // 7. Processamento da Resposta
    // Na SDK nova, result.text() é um método
    const jsonText = result.text;
    
    if (!jsonText) throw new Error("A IA não retornou conteúdo.");

    const cleanJson = jsonText.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    // 8. Tratamento Numérico (Blindagem)
    const parseCurrency = (val: any) => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const cleaned = val.replace(/[^\d.,]/g, '').replace(',', '.');
        return parseFloat(cleaned) || 0;
      }
      return 0;
    };

    const cleanTotal = parseCurrency(data.total);

    // 9. Gerador de Slug Amigável (Ex: pintura-sala-4029)
    const empresaSlug = (data.titulo || "orcamento")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^a-z0-9]/g, '-')     // Remove caracteres especiais
      .replace(/-+/g, '-')            // Remove hifens duplicados
      .replace(/^-|-$/g, '');         // Remove hifens nas pontas

    // 10. Salvamento no Banco
    const savedProposal = await prisma.proposal.create({
      data: {
        userId: user.id, 
        title: data.titulo || "Orçamento Profissional",
        description: `${data.descricao}\n\n${data.observacoes_pagamento || ''}`,
        totalAmount: cleanTotal,
        validity: 15,
        // Slug único com número aleatório para evitar colisão
        slug: `${empresaSlug}-${Math.floor(1000 + Math.random() * 9000)}`,
        items: {
          create: data.itens?.map((item: any) => {
            const unitP = parseCurrency(item.preco_unitario);
            const qty = Number(item.quantity || item.quantidade) || 1;
            return {
              description: item.nome || item.description,
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