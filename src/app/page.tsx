import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { FileText, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />
      <main>
        <Hero />
        
        {/* Seção de Benefícios Curta */}
        <section className="bg-white py-20 border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<FileText className="text-blue-600" />} 
              title="Adeus Word" 
              desc="Esqueça o computador. Faça tudo pelo celular enquanto está no cliente." 
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-blue-600" />} 
              title="+ Profissionalismo" 
              desc="Transmita confiança com propostas estruturadas e organizadas pela IA." 
            />
            <FeatureCard 
              icon={<Zap className="text-blue-600" />} 
              title="Receba via PIX" 
              desc="O link já vai com seu QR Code. Pagamento rápido e sem atrito." 
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="text-center p-6">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}