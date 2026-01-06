import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { CookieConsent } from "@/components/CookieConsent";

// Instanciando a fonte Inter (padrão de mercado)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fechou-AI - Orçamentos Profissionais",
  description: "Transforme voz em orçamentos profissionais com PIX em segundos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="pt-BR">
      {/* Aplicando a classe da fonte no body */}
      <body className={`${inter.className} antialiased`}>
        {children}
        <CookieConsent />
      </body>
    </html>
    </ClerkProvider>
  );
}