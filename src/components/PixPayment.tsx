"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function PixPayment({ pixCode }: { pixCode: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm">
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Pagamento via PIX</h3>
      
      {/* QR Code */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 mb-4">
        <QRCodeSVG value={pixCode} size={180} />
      </div>

      {/* Copia e Cola */}
      <div className="w-full">
        <p className="text-xs text-center text-slate-500 mb-2">Código Copia e Cola:</p>
        <div className="flex gap-2">
          <input 
            readOnly 
            value={pixCode} 
            className="flex-1 text-[10px] bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-500 font-mono truncate"
          />
          <button 
            onClick={handleCopy}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
            title="Copiar código"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}