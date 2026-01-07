//src/app/dashboard/novo/page.tsx

"use client";

import { useState, useRef } from "react";
import { Mic, Square, ArrowLeft, Loader2, Keyboard, TextCursorInput, Cpu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UpgradeModal } from "@/components/UpgradeModal"; // Importe o modal

export default function NovoOrcamento() {
  const router = useRouter();
  
  // Estados da Interface
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false); // NOVO

  // Refs para áudio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // --- 1. LÓGICA DE GRAVAÇÃO ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], "gravacao.webm", { type: "audio/webm" });
        stream.getTracks().forEach(track => track.stop());
        sendToAI(audioFile, null);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Erro ao acessar microfone:", err);
      alert("Por favor, permita o acesso ao microfone no navegador.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    isRecording ? stopRecording() : startRecording();
  };

  // --- 2. LÓGICA DE ENVIO (COM TRATAMENTO DO PAYWALL) ---
  const sendToAI = async (audioFile: File | null, text: string | null) => {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      if (audioFile) formData.append("audio", audioFile);
      if (text) formData.append("text", text);

      const response = await fetch("/api/orcamento", {
        method: "POST",
        body: formData,
      });

      // Se for 403, significa que estourou o limite -> Abre Modal
      if (response.status === 403) {
        setIsProcessing(false);
        setShowUpgradeModal(true);
        return;
      }

      if (!response.ok) throw new Error("Erro ao comunicar com a IA");

      const data = await response.json();
      
      if (data.id) {
        router.push(`/dashboard/orcamento/${data.id}`);
      } else {
        throw new Error("A API não retornou um ID válido.");
      }

    } catch (error) {
      console.error(error);
      alert("Ops! Ocorreu um erro ao gerar. Tente novamente.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      
      <nav className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-lg">Novo Orçamento</h1>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col items-center">
        
        {/* SELETOR DE MODO */}
        {!isProcessing && (
          <div className="flex bg-slate-200 p-1 rounded-full mb-8 shadow-inner animate-in fade-in slide-in-from-top-4">
            <button 
              onClick={() => setMode("voice")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === "voice" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Mic size={16} /> Gravar Áudio
            </button>
            <button 
              onClick={() => setMode("text")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === "text" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Keyboard size={16} /> Digitar
            </button>
          </div>
        )}

        {/* TELA DE PROCESSAMENTO */}
        {isProcessing && (
           <div className="w-full bg-white rounded-3xl p-12 shadow-lg border border-slate-200 text-center mb-8 animate-in fade-in duration-500">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu size={24} className="text-blue-600/30 animate-pulse" />
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">IA Trabalhando...</h2>
                    <p className="text-slate-500 max-w-xs mx-auto">
                      Estamos analisando seu pedido e estruturando o documento final.
                    </p>
                </div>
              </div>
           </div>
        )}

        {/* --- MODO VOZ --- */}
        {!isProcessing && mode === "voice" && (
          <div className="flex flex-col items-center w-full animate-in slide-in-from-bottom-4 duration-300">
             <div className="w-full bg-blue-50/50 rounded-3xl p-8 border border-blue-100 text-center mb-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-blue-600 text-xs font-bold uppercase tracking-wider shadow-sm">
                    <Mic size={14} /> Modo Voz
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Fale os detalhes</h2>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Toque no botão e descreva o serviço naturalmente. <br/>
                    <span className="italic text-slate-400 text-sm">Ex: "Troca de disjuntor, 150 reais de mão de obra + 40 da peça."</span>
                  </p>
                </div>
             </div>

             <div className="relative flex flex-col items-center group">
                {isRecording && (
                  <div className="absolute -inset-8 bg-red-100 rounded-full animate-ping opacity-50 -z-10"></div>
                )}
                <button
                  onClick={toggleRecording}
                  className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 hover:scale-105 cursor-pointer border-4 ${
                    isRecording 
                      ? "bg-red-500 hover:bg-red-600 border-red-200" 
                      : "bg-blue-600 hover:bg-blue-700 border-blue-200"
                  }`}
                >
                  {isRecording ? <Square className="text-white w-8 h-8 fill-current" /> : <Mic className="text-white w-10 h-10" />}
                </button>
                <p className={`mt-6 font-bold text-lg transition-colors ${isRecording ? "text-red-500 animate-pulse" : "text-slate-400"}`}>
                  {isRecording ? "Gravando... (Toque para Finalizar)" : "Toque para falar"}
                </p>
             </div>
          </div>
        )}

        {/* --- MODO TEXTO --- */}
        {!isProcessing && mode === "text" && (
          <div className="w-full animate-in slide-in-from-bottom-4 duration-300">
             <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-6 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm font-medium">
                  <TextCursorInput size={16} /> Digite os detalhes do serviço
                </div>
                <textarea 
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Ex: Instalação de pia de cozinha. R$ 200 mão de obra + R$ 50 de sifão e veda rosca. Pagamento via PIX."
                  className="w-full h-48 p-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none text-lg text-slate-800 placeholder:text-slate-400 transition-colors"
                />
             </div>
             <button 
               onClick={() => sendToAI(null, textContent)}
               disabled={!textContent.trim()}
               className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
             >
               <Cpu size={18} /> Gerar Orçamento
             </button>
          </div>
        )}

        {/* --- MODAL DE UPGRADE --- */}
        <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
        />

      </main>
    </div>
  );
}