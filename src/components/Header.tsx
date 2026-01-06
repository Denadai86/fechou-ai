"use client";

import { CheckCircle2 } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Fechou<span className="text-blue-600 font-mono">-AI</span>
          </span>
        </div>

        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <a href="#como-funciona" className="hover:text-blue-600 transition-colors">Como funciona</a>
          <a href="#precos" className="hover:text-blue-600 transition-colors">Preços</a>
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-bold text-blue-600 border border-blue-100 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors cursor-pointer">
                Entrar
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <button className="text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer mr-2">
                Meu Painel
              </button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}