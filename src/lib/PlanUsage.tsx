import { getPlanUsage } from "@/lib/limiter";
import { auth } from "@clerk/nextjs/server";
import { Crown, AlertCircle } from "lucide-react";
import Link from "next/link";

export async function PlanUsage() {
  const { userId } = await auth();
  if (!userId) return null;

  const { isPro, usage, limit, remaining } = await getPlanUsage(userId);

  // Se for PRO, mostra badge VIP
  if (isPro) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 border border-orange-200 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">
        <Crown size={14} className="fill-current" />
        Membro PRO
      </div>
    );
  }

  // Se for FREE, mostra a contagem regressiva
  // Muda de cor se estiver acabando (0 restantes = Vermelho)
  const isCritical = remaining === 0;
  
  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border ${
      isCritical 
        ? "bg-red-50 border-red-200 text-red-700" 
        : "bg-blue-50 border-blue-200 text-blue-700"
    }`}>
      <div className="flex flex-col">
         <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Plano Grátis</span>
         <div className="flex items-center gap-2">
            <span className="text-lg font-black leading-none">
              {remaining}
            </span>
            <span className="text-xs font-bold leading-none">
              restantes
            </span>
         </div>
      </div>

      {/* Barra de Progresso Mini */}
      <div className="h-8 w-1 bg-black/5 rounded-full overflow-hidden relative">
         <div 
           className={`absolute bottom-0 w-full rounded-full transition-all duration-500 ${isCritical ? "bg-red-500" : "bg-blue-500"}`}
           style={{ height: `${(usage / limit) * 100}%` }}
         />
      </div>

      {isCritical && (
        <Link href="/dashboard/novo" className="ml-2">
           <button className="bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 shadow-sm animate-pulse">
             <Crown size={14} />
           </button>
        </Link>
      )}
    </div>
  );
}