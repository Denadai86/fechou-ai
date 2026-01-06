"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-100 p-4">
      <div className="max-w-4xl mx-auto bg-slate-900 text-white p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700">
        <div className="text-sm text-slate-300 text-center md:text-left">
          Utilizamos cookies para melhorar sua experiência e analisar o tráfego do site. 
          Ao continuar navegando, você concorda com nossa{" "}
          <Link href="/privacidade" className="underline hover:text-white">Política de Privacidade</Link>.
        </div>
        <button 
          onClick={acceptCookies}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition-colors whitespace-nowrap cursor-pointer"
        >
          Aceitar Cookies
        </button>
      </div>
    </div>
  );
}