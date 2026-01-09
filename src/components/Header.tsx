"use client";

"use client";

import { LayoutDashboard } from "lucide-react"; // Removemos o CheckCircle2
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image"; // <--- Importante: Importar o Image do Next

export function Header() {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {/* Substituímos o ícone antigo pela Imagem da Logo */}
          <div className="relative w-8 h-8"> 
             <Image 
               src="/logo.png" 
               alt="Logo Fechou-AI" 
               fill 
               className="object-contain"
             />
          </div>
          
          {/* Mantemos o texto pois ajuda no SEO, ou você pode remover se a logo já tiver o nome escrito */}
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Fechou<span className="text-blue-600 font-mono">-AI</span>
          </span>
        </Link>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <Link href="/#como-funciona" className="hover:text-blue-600 transition-colors">
            Como funciona
          </Link>
          <Link href="/#precos" className="hover:text-blue-600 transition-colors">
            Preços
          </Link>
        </div>

        {/* ÁREA DE AÇÃO */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer px-3 py-2">
                Entrar
              </button>
            </SignInButton>
            <SignInButton mode="modal">
              <button className="text-sm font-bold bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                Começar Grátis
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <Link href="/dashboard">
                <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors border border-slate-200 hover:border-blue-100">
                  <LayoutDashboard size={16} />
                  <span className="hidden sm:inline">Painel</span>
                </button>
              </Link>
              
              <UserButton 
                afterSignOutUrl="/"
                userProfileMode="modal"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 border-2 border-white shadow-sm"
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>

      </div>
    </nav>
  );
}