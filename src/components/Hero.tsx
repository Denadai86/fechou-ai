"use client";

import { Mic, Smartphone, Cpu, QrCode, MessageCircle, Zap } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="pt-32 pb-16 md:pt-40 lg:flex items-center gap-12 max-w-6xl mx-auto px-4">
      <div className="flex-1 space-y-8 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-200">
          <Cpu size={14} className="fill-current" /> Tecnologia embarcada
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
          Você fala, a <span className="text-indigo-600">IA</span> cria o <br className="hidden md:block"/>
          <span className="text-blue-600">orçamento na hora.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
          Nossa IA entende sua voz, estrutura os valores e gera o link de pagamento PIX no WhatsApp em 30 segundos.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-green-500 text-white font-bold rounded-full px-8 py-4 text-lg shadow-lg hover:-translate-y-1 cursor-pointer flex items-center justify-center">
                <Smartphone className="w-5 h-5 mr-2" /> Testar IA Grátis
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <button className="bg-blue-600 text-white font-bold rounded-full px-8 py-4 text-lg shadow-lg hover:-translate-y-1 cursor-pointer flex items-center justify-center">
                <Mic className="w-5 h-5 mr-2" /> Ir para o Painel
              </button>
            </Link>
          </SignedIn>
          
          <p className="text-xs text-slate-400 mt-2 sm:mt-0 sm:self-center">
            Sem cartão • 10 dias grátis
          </p>
        </div>
      </div>

      <div className="flex-1 mt-12 lg:mt-0 relative">
        <div className="relative z-10 mx-auto w-72 bg-white rounded-[2.5rem] shadow-2xl border-8 border-slate-900 overflow-hidden">
          <div className="bg-slate-900 h-6 w-full flex justify-center items-center">
            <div className="w-16 h-4 bg-black rounded-b-xl"></div>
          </div>
          <div className="p-4 bg-slate-50 h-120 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-slate-700">Novo Orçamento</span>
              <Mic size={16} className="text-blue-600" />
            </div>
            <div className="space-y-3 mb-4">
              <div className="bg-blue-600 text-white p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl text-xs shadow-sm">
                "Instalação de torneira e reparo no cano. R$ 120."
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-tl-xl rounded-bl-xl rounded-br-xl text-xs animate-pulse flex items-center gap-2">
                <Cpu size={12} className="text-indigo-500 animate-spin" />
                <span className="text-slate-500">IA Processando...</span>
              </div>
            </div>
            <div className="mt-auto bg-white rounded-xl shadow-lg border border-slate-100 p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-800 text-xs">Orçamento #2093</h3>
                <span className="text-green-700 text-xs font-bold">R$ 120,00</span>
              </div>
              <div className="bg-slate-100 rounded-lg p-2 flex items-center gap-3 mb-3">
                <QrCode size={20} className="text-slate-900" />
                <span className="text-[10px] text-slate-600 font-mono">PIX ATIVO</span>
              </div>
              <button className="w-full bg-green-500 text-white py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1">
                <MessageCircle size={12} /> Enviar no Zap
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-10 -right-10 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      </div>
    </section>
  );
}