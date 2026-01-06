import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; 
import { PerfilForm } from "./PerfilForm";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react"; // Importe AlertTriangle

// Adicione searchParams aqui
export default async function PerfilPage({ searchParams }: { searchParams: { msg?: string } }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const perfil = await prisma.user.findUnique({
    where: { id: user.id },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* AVISO DE TRAVA (Só aparece se vier redirecionado) */}
      {searchParams.msg === "complete_cadastro" && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
            <div className="max-w-4xl mx-auto flex items-center gap-3 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-bold text-sm">
                    Para criar orçamentos, você precisa salvar seus dados de contato primeiro.
                </p>
            </div>
        </div>
      )}

      <nav className="bg-white border-b border-slate-200 px-4 py-4 mb-8">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-lg">Meu Negócio</h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4">
        <PerfilForm initialData={perfil} />
      </main>
    </div>
  );
}