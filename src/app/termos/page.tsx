import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Header />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>
        <div className="prose prose-slate space-y-6">
          <p>Bem-vindo ao <strong>Fechou-AI</strong>. Ao utilizar nossos serviços, você concorda com os seguintes termos:</p>
          
          <h2 className="text-xl font-semibold">1. Uso do Serviço</h2>
          <p>O Fechou-AI é uma ferramenta de auxílio na criação de orçamentos via inteligência artificial. O usuário é o único responsável pela veracidade dos dados inseridos e pelos valores cobrados em seus orçamentos.</p>
          
          <h2 className="text-xl font-semibold">2. Assinaturas e Pagamentos</h2>
          <p>Oferecemos planos mensais e anuais. O cancelamento pode ser feito a qualquer momento pelo painel do usuário, interrompendo a renovação para o próximo ciclo.</p>
          
          <h2 className="text-xl font-semibold">3. Responsabilidade</h2>
          <p>Não nos responsabilizamos por acordos comerciais feitos entre o usuário e seus clientes finais. O Fechou-AI fornece apenas a tecnologia de facilitação.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}