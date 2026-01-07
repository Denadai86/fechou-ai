import Link from "next/link";
import { Mic, CheckCircle2, Zap, ShieldCheck, Phone } from 'lucide-react';
import { auth } from "@clerk/nextjs/server";
// 1. IMPORTANDO SEU COMPONENTE ORIGINAL
import { Footer } from "@/components/Footer"; 

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Zap className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900">FECHOU-AI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href={userId ? "/dashboard" : "/sign-in"} className="text-sm font-bold text-slate-600 hover:text-blue-600 hidden md:block">
              {userId ? "Ir para o Painel" : "Login"}
            </Link>
            <Link href={userId ? "/dashboard" : "/sign-up"}>
              <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95">
                {userId ? "Meu Painel" : "Começar Grátis"}
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24">
        
        {/* --- HERO SECTION --- */}
        <section className="relative px-6 pb-20 pt-10 md:pt-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            
            {/* Texto Hero */}
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-700 fade-in">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                IA Gemini 3 Ativada
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black leading-[1.1] text-slate-900">
                Orçamentos de elite com <span className="text-blue-600">sua voz.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg">
                Pare de perder horas no Word. Fale o que precisa ser feito e nossa IA cria, calcula e formata uma proposta irresistível em segundos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up" className="flex-1 sm:flex-none">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transition-all hover:-translate-y-1">
                    <Mic className="w-5 h-5" /> Testar com Voz
                  </button>
                </Link>
                <Link href="#como-funciona" className="flex-1 sm:flex-none">
                   <button className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                    Ver Exemplo
                   </button>
                </Link>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                <div className="flex -space-x-2">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
                   ))}
                </div>
                <p>Usado por +100 profissionais</p>
              </div>
            </div>

            {/* Visual / Mockup Dinâmico */}
            <div className="relative animate-in slide-in-from-right-4 duration-1000 fade-in hidden md:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />
              
              <div className="relative mx-auto w-[300px] h-[600px] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800 rotate-[-3deg] hover:rotate-0 transition-all duration-500">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-20"></div>
                 
                 <div className="w-full h-full bg-slate-50 rounded-[2rem] overflow-hidden flex flex-col relative">
                    
                    <div className="bg-white p-6 pb-8 border-b border-slate-100 pt-12">
                       <div className="w-12 h-12 bg-blue-600 rounded-xl mb-3 flex items-center justify-center text-white font-bold text-xl">SR</div>
                       <h3 className="font-bold text-slate-900">Silva Reformas</h3>
                       <p className="text-xs text-slate-500">Especialista em Elétrica</p>
                    </div>

                    <div className="p-4 space-y-3">
                       <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                          <div>
                             <p className="font-bold text-xs text-slate-900">Instalação Chuveiro</p>
                             <p className="text-[10px] text-slate-500">Mão de obra e fiação</p>
                          </div>
                          <span className="font-bold text-sm text-slate-900">R$ 150</span>
                       </div>
                       <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                          <div>
                             <p className="font-bold text-xs text-slate-900">Troca de Tomadas</p>
                             <p className="text-[10px] text-slate-500">Kit 3 unidades padrão novo</p>
                          </div>
                          <span className="font-bold text-sm text-slate-900">R$ 90</span>
                       </div>
                    </div>

                    <div className="mt-auto bg-white p-4 border-t border-slate-100">
                        <div className="flex justify-between items-end mb-4">
                           <span className="text-xs font-bold text-slate-400 uppercase">Total Final</span>
                           <span className="text-2xl font-black text-blue-600">R$ 240,00</span>
                        </div>
                        <button className="w-full bg-green-500 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                           <Phone size={16} /> Aprovar no WhatsApp
                        </button>
                    </div>

                    <div className="absolute top-20 left-4 right-4 bg-slate-900/90 backdrop-blur text-white p-3 rounded-xl text-xs flex items-center gap-3 animate-pulse">
                        <div className="bg-green-500 w-2 h-2 rounded-full"></div>
                        IA gerou este orçamento em 3s
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SOCIAL PROOF --- */}
        <section className="py-10 border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Ideal para todo tipo de profissional</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               <span className="font-bold text-xl flex items-center gap-2"><Zap size={20}/> Eletricistas</span>
               <span className="font-bold text-xl flex items-center gap-2"><ShieldCheck size={20}/> Climatização</span>
               <span className="font-bold text-xl flex items-center gap-2"><Phone size={20}/> Técnicos TI</span>
               <span className="font-bold text-xl flex items-center gap-2"><CheckCircle2 size={20}/> Reformas</span>
            </div>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section id="como-funciona" className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Você fala, a gente faz o resto.</h2>
               <p className="text-lg text-slate-600">Nosso sistema foi treinado para entender "conversa de obra" e transformar em documento oficial.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               <FeatureCard 
                 icon={<Mic className="w-6 h-6 text-white" />}
                 color="bg-blue-600"
                 title="Entrada por Voz"
                 desc="Grave um áudio de 30 segundos explicando o serviço. Nossa IA transcreve e entende o contexto técnico."
               />
               <FeatureCard 
                 icon={<Zap className="w-6 h-6 text-white" />}
                 color="bg-purple-600"
                 title="Cálculo Automático"
                 desc="Não use calculadora. A IA identifica quantidades, preços unitários e aplica descontos se você pedir."
               />
               <FeatureCard 
                 icon={<ShieldCheck className="w-6 h-6 text-white" />}
                 color="bg-green-600"
                 title="Link Profissional"
                 desc="Seu cliente recebe um link seguro (com HTTPS) que passa credibilidade e já tem botão de PIX."
               />
            </div>
          </div>
        </section>

        {/* --- CTA FINAL --- */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
             <div className="relative z-10 space-y-8">
               <h2 className="text-3xl md:text-5xl font-black text-white">Pronto para fechar mais serviços?</h2>
               <p className="text-slate-300 text-lg max-w-xl mx-auto">
                 Junte-se a profissionais que economizam horas de escritório toda semana.
               </p>
               <Link href="/sign-up">
                 <button className="bg-white text-slate-900 hover:bg-blue-50 px-10 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-xl">
                   Criar Orçamento Agora
                 </button>
               </Link>
               <p className="text-slate-500 text-xs mt-4">Não requer cartão de crédito • Plano Grátis disponível</p>
             </div>
          </div>
        </section>

      </main>

      {/* 2. RODAPÉ ORIGINAL RESTAURADO AQUI */}
      <Footer />
    </div>
  );
}

function FeatureCard({ icon, color, title, desc }: { icon: React.ReactNode, color: string, title: string, desc: string }) {
  return (
    <div className="group hover:-translate-y-2 transition-all duration-300 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-black text-xl text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}