"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Usando a API moderna de clipboard com fallback
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback para navegadores antigos ou conexões não seguras
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Falha ao copiar link:", err);
    }
  };

  return (
    <button 
      onClick={handleCopy} 
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all cursor-pointer
        ${copied 
          ? "bg-green-600 text-white scale-95" 
          : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"}
      `}
    >
      {copied ? (
        <>
          <Check size={18} className="animate-in zoom-in duration-300" />
          <span className="hidden sm:inline">Copiado!</span>
        </>
      ) : (
        <>
          <Share2 size={18} />
          <span className="hidden sm:inline">Copiar Link</span>
        </>
      )}
    </button>
  );
}