"use client";

import { useState } from "react";
import { Save, Loader2, Building2, Wallet, Contact, Palette } from "lucide-react";
import { salvarPerfil } from "./actions";

export function PerfilForm({ initialData }: any) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
        await salvarPerfil(formData);
        alert("Perfil salvo com sucesso!");
    } catch (error) {
        alert("Erro ao salvar.");
        console.error(error);
    } finally {
        setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      
      {/* BLOCO 1: IDENTIDADE */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 text-blue-600">
            <Building2 />
            <h2 className="font-bold text-lg">Identidade do Negócio</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Fantasia / Empresa *</label>
                <input required name="companyName" defaultValue={initialData?.companyName || ""} placeholder="Ex: Silva Reformas" className="w-full p-2 border rounded-lg" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CPF ou CNPJ</label>
                <input name="cpfCnpj" defaultValue={initialData?.cpfCnpj || ""} placeholder="000.000.000-00" className="w-full p-2 border rounded-lg" />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço Comercial</label>
                <input name="address" defaultValue={initialData?.address || ""} placeholder="Rua, Número, Bairro, Cidade" className="w-full p-2 border rounded-lg" />
            </div>
        </div>
      </section>

      {/* BLOCO 2: CONTATO */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 text-green-600">
            <Contact />
            <h2 className="font-bold text-lg">Contatos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp (que sai no orçamento) *</label>
                <input required name="phone" defaultValue={initialData?.phone || ""} placeholder="(11) 99999-9999" className="w-full p-2 border rounded-lg" />
            </div>
        </div>
      </section>

      {/* BLOCO 3: FINANCEIRO (PIX) */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 text-purple-600">
            <Wallet />
            <h2 className="font-bold text-lg">Dados de Recebimento</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chave PIX</label>
                <input name="pixKey" defaultValue={initialData?.pixKey || ""} placeholder="CPF, E-mail ou Telefone" className="w-full p-2 border rounded-lg" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Titular (Opcional)</label>
                <input name="pixHolder" defaultValue={initialData?.pixHolder || ""} className="w-full p-2 border rounded-lg" />
            </div>
            <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-slate-700 mb-1">Dados Bancários Extras (Opcional)</label>
                 <input name="bankDetails" defaultValue={initialData?.bankDetails || ""} placeholder="Banco X, Agência Y..." className="w-full p-2 border rounded-lg" />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Assinatura / Despedida</label>
                <textarea name="signature" defaultValue={initialData?.signature || "Agradeço a preferência e fico à disposição!"} className="w-full p-2 border rounded-lg h-24" />
            </div>
        </div>
      </section>

      <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer">
        {loading ? <Loader2 className="animate-spin" /> : <Save />}
        Salvar Informações
      </button>
    </form>
  );
}