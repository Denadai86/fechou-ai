//src/app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; 
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
// 1. REATIVADO AQUI:
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "Fechou-AI | Orçamentos Profissionais via WhatsApp",
  description: "Crie propostas irrecusáveis usando apenas sua voz. A IA escreve, calcula e gera o link de pagamento PIX em segundos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased text-slate-900 bg-slate-50`}>
        {children}
        
        {/* 2. REATIVADO AQUI: O Banner vai aparecer agora */}
        <CookieConsent /> 
      </body>
    </html>
    </ClerkProvider>
  );
}