import { CheckCircle2 } from "lucide-react";
import Link from "next/link"; // Importante para navegação interna

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-slate-900 p-1.5 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold text-slate-900">
            Fechou<span className="text-blue-600 font-mono">-AI</span>
          </span>
        </div>
        <h3 className="text-2xl font-bold mb-8 max-w-lg text-slate-800">
          Pronto para profissionalizar seu negócio e cobrar melhor?
        </h3>
        
        <div className="mt-12 text-sm text-slate-400">
          <p>© 2026 Fechou-AI - Um produto <a href="https://acaoleve.com" target="_blank" className="hover:text-blue-600 underline">Ação Leve</a>.</p>
          <div className="flex gap-6 justify-center mt-4 font-medium">
            <Link href="/termos" className="hover:text-slate-600 transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-slate-600 transition-colors">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}