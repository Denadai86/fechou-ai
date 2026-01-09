import Link from "next/link";
import { Mic, Zap, ShieldCheck, Check, HelpCircle, ArrowRight } from 'lucide-react';
import { auth } from "@clerk/nextjs/server";
import { Footer } from "@/components/Footer"; 
import { Header } from "@/components/Header"; // 1. Usando seu Header novo com a Logo

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-slate-50">
      
      {/* 1. Header Global (Já com a Logo nova) */}
      <Header />

      <main className="flex-1 pt-24">
        
        {/* --- HERO SECTION --- */}
        <section className="relative px-6 pb-20 pt-10 md:pt-20 overflow-hidden">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
            
            {/* Texto Hero */}
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-700 fade-in">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                IA Generativa 3.0
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black leading-[1.1] text-slate-900">
                Orçamentos de elite com <span className="text-blue-600">sua voz.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg">
                Profissional de verdade não perde tempo no Word. Grave um áudio e deixe nossa IA criar, calcular e formatar uma proposta irresistível em segundos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up" className="flex-1 sm:flex-none">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transition-all hover:-translate-y-1">
                    <Mic className="w-5 h-5" /> Testar Agora
                  </button>
                </Link>
                <Link href="#demonstracao" className="flex-1 sm:flex-none">
                   <button className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                   Ver Exemplo
                   </button>
                </Link>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 font-medium pt-2">
                <div className="flex -space-x-2">
                   {[1,2,3,4].map(i => (
                     <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden`}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="avatar" />
                     </div>
                   ))}
                </div>
                <p>Junte-se a +100 profissionais</p>
              </div>
            </div>

            {/* Visual / Mockup - Mantive o seu CSS pois é leve e bonito */}
            <div className="relative animate-in slide-in-from-right-4 duration-1000 fade-in hidden md:block group perspective-1000">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] -z-10" />
              
              <div className="relative mx-auto w-[320px] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800 rotate-[-2deg] group-hover:rotate-0 transition-all duration-700 ease-out hover:scale-105">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-xl z-20"></div>
                 
                 {/* Simulação da Tela do App */}
                 <div className="w-full bg-slate-50 rounded-[2rem] overflow-hidden flex flex-col relative min-h-[600px]">
                    <div className="bg-white p-6 pb-6 border-b border-slate-100 pt-12">
                       <div className="flex justify-between items-start">
                         <div>
                            <div className="w-10 h-10 bg-blue-600 rounded-lg mb-2 flex items-center justify-center text-white font-bold">SR</div>
                            <h3 className="font-bold text-slate-900 leading-tight">Silva Reformas</h3>
                            <p className="text-[10px] text-slate-500">CNPJ: 45.123.000/0001-99</p>
                         </div>
                         <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">Orçamento #240</div>
                       </div>
                    </div>

                    <div className="p-4 space-y-3">
                       <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                          <div>
                             <p className="font-bold text-xs text-slate-900">Instalação Chuveiro</p>
                             <p className="text-[10px] text-slate-500">Mão de obra e fiação 6mm</p>
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
                       {/* Item extra para dar volume */}
                       <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center opacity-50">
                          <div>
                             <p className="font-bold text-xs text-slate-900">Visita Técnica</p>
                             <p className="text-[10px] text-slate-500">Deslocamento e avaliação</p>
                          </div>
                          <span className="font-bold text-sm text-slate-900">Grátis</span>
                       </div>
                    </div>

                    <div className="mt-auto bg-white p-4 border-t border-slate-100">
                        <div className="flex justify-between items-end mb-4">
                           <span className="text-xs font-bold text-slate-400 uppercase">Total Final</span>
                           <span className="text-2xl font-black text-blue-600">R$ 240,00</span>
                        </div>
                        <div className="w-full bg-green-500 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                           Aprovar no WhatsApp
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SOCIAL PROOF --- */}
        <section className="py-8 border-y border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Aprovado por profissionais de</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
               {['Elétrica', 'Climatização', 'Pintura', 'Marcenaria', 'TI & Redes'].map(n => (
                  <span key={n} className="font-bold text-lg md:text-xl text-slate-900">{n}</span>
               ))}
            </div>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section id="como-funciona" className="py-24 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Você fala, a gente faz o resto.</h2>
               <p className="text-lg text-slate-600">Esqueça planilhas complicadas. Nosso sistema foi treinado para entender "conversa de obra".</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               <FeatureCard 
                 icon={<Mic className="w-6 h-6 text-white" />}
                 color="bg-blue-600"
                 title="Entrada por Voz"
                 desc="Grave um áudio de 30 segundos explicando o serviço. Nossa IA transcreve, organiza e entende o contexto técnico."
               />
               <FeatureCard 
                 icon={<Zap className="w-6 h-6 text-white" />}
                 color="bg-purple-600"
                 title="Cálculo Automático"
                 desc="Não use calculadora. A IA identifica quantidades, preços unitários e soma tudo automaticamente sem erros."
               />
               <FeatureCard 
                 icon={<ShieldCheck className="w-6 h-6 text-white" />}
                 color="bg-green-600"
                 title="Link Profissional"
                 desc="Seu cliente recebe um link seguro (HTTPS) com sua marca, botão de aprovação e chave PIX integrada."
               />
            </div>
          </div>
        </section>

        {/* --- PREÇOS (NOVO - O Pulo do Gato) --- */}
        <section id="precos" className="py-24 bg-white relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
           
           <div className="max-w-6xl mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Investimento que se paga no 1º serviço</h2>
                 <p className="text-slate-600">Comece grátis. Evolua quando sua agenda lotar.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                 {/* Plano FREE */}
                 <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-slate-300 transition-all">
                    <h3 className="text-xl font-bold text-slate-900">Iniciante</h3>
                    <div className="my-4">
                       <span className="text-4xl font-black text-slate-900">R$ 0</span>
                       <span className="text-slate-500">/mês</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-8">Para quem está começando e quer testar a ferramenta.</p>
                    <Link href="/sign-up">
                       <button className="w-full py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                          Começar Grátis
                       </button>
                    </Link>
                    <ul className="mt-8 space-y-4 text-sm text-slate-600">
                       <li className="flex gap-3"><Check className="w-5 h-5 text-green-500" /> 3 orçamentos por mês</li>
                       <li className="flex gap-3"><Check className="w-5 h-5 text-green-500" /> IA de Voz Básica</li>
                       <li className="flex gap-3"><Check className="w-5 h-5 text-green-500" /> Link de compartilhamento</li>
                    </ul>
                 </div>

                 {/* Plano PRO */}
                 <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-white relative transform md:scale-105 shadow-2xl">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-widest">
                       Mais Popular
                    </div>
                    <h3 className="text-xl font-bold">Profissional</h3>
                    <div className="my-4">
                       <span className="text-4xl font-black">R$ 29,90</span>
                       <span className="text-slate-400">/mês</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-8">Para quem quer liberdade total e fechar mais negócios.</p>
                    <Link href="/sign-up">
                       <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white transition-colors shadow-lg shadow-blue-900/50">
                          Ser Profissional
                       </button>
                    </Link>
                    <ul className="mt-8 space-y-4 text-sm text-slate-300">
                       <li className="flex gap-3"><Check className="w-5 h-5 text-blue-400" /> <strong>Orçamentos Ilimitados</strong></li>
                       <li className="flex gap-3"><Check className="w-5 h-5 text-blue-400" /> IA Gemini Avançada (Mais rápida)</li>
                       <li className="flex gap-3"><Check className="w-5 h-5 text-blue-400" /> Personalização de Logo e Cor</li>
                       <li className="flex gap-3"><Check className="w-5 h-5 text-blue-400" /> Suporte Prioritário</li>
                    </ul>
                 </div>
              </div>
           </div>
        </section>

        {/* --- FAQ (NOVO - Quebra de Objeção) --- */}
        <section className="py-24 bg-slate-50">
           <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-12 text-center">Perguntas Frequentes</h2>
              <div className="space-y-4">
                 <FAQItem 
                   question="Funciona no celular?" 
                   answer="Sim! O Fechou-AI roda direto no navegador do seu celular, não precisa instalar nada e não ocupa memória."
                 />
                 <FAQItem 
                   question="Meu cliente precisa ter o app?" 
                   answer="Não. Seu cliente recebe um link profissional (como um site) que abre em qualquer lugar."
                 />
                 <FAQItem 
                   question="Como funciona o pagamento?" 
                   answer="Você pode usar o plano grátis para sempre. Se quiser o PRO, o pagamento é mensal via Cartão ou PIX, processado com segurança pelo Mercado Pago."
                 />
                 <FAQItem 
                   question="É seguro colocar meus dados?" 
                   answer="Totalmente. Usamos criptografia de ponta e autenticação via Clerk e Google, as mesmas tecnologias de grandes bancos."
                 />
              </div>
           </div>
        </section>

        {/* --- CTA FINAL --- */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto bg-blue-600 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-200">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             <div className="relative z-10 space-y-8">
               <h2 className="text-3xl md:text-5xl font-black text-white">Pare de perder orçamentos hoje.</h2>
               <p className="text-blue-100 text-lg max-w-xl mx-auto">
                 Crie sua conta em 30 segundos e envie seu primeiro orçamento profissional ainda hoje.
               </p>
               <Link href="/sign-up">
                 <button className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-xl flex items-center gap-2 mx-auto">
                   Criar Orçamento Grátis <ArrowRight size={20} />
                 </button>
               </Link>
             </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, color, title, desc }: { icon: React.ReactNode, color: string, title: string, desc: string }) {
  return (
    <div className="group hover:-translate-y-2 transition-all duration-300 p-8 rounded-3xl bg-white border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-black text-xl text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
   return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-200 transition-colors">
         <h3 className="font-bold text-slate-900 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            {question}
         </h3>
         <p className="text-slate-500 mt-2 ml-8 text-sm leading-relaxed">{answer}</p>
      </div>
   )
}