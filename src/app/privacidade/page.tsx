import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Header />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
        <div className="prose prose-slate space-y-6">
          <p>Sua privacidade é importante para nós. Esta política explica como lidamos com seus dados no <strong>Fechou-AI</strong>.</p>
          
          <h2 className="text-xl font-semibold">1. Coleta de Dados</h2>
          <p>Coletamos seu nome e e-mail via Clerk para autenticação, e os áudios enviados para processamento da inteligência artificial.</p>
          
          <h2 className="text-xl font-semibold">2. Uso de Áudio</h2>
          <p>Os áudios são processados temporariamente para transcrição e geração do orçamento. Não comercializamos seus dados ou informações de seus clientes com terceiros.</p>
          
          <h2 className="text-xl font-semibold">3. Seus Direitos</h2>
          <p>Você pode solicitar a exclusão de sua conta e de todos os dados associados a qualquer momento através do nosso suporte.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}