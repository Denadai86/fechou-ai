//src/app/dashboard/perfil/PerfilForm.tsx

"use client";

import { useState, useRef } from "react";
import { Save, Loader2, Building2, Wallet, Contact, Upload, X, ImageIcon } from "lucide-react";
import { salvarPerfil } from "./actions";
import { upload } from "@vercel/blob/client";

export function PerfilForm({ initialData }: any) {
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para lidar com o Upload da Logomarca
  async function handleLogoUpload() {
    if (!fileInputRef.current?.files?.[0]) return;

    const file = fileInputRef.current.files[0];
    setIsUploading(true);

    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      setLogoUrl(newBlob.url);
    } catch (error) {
      alert("Erro ao subir imagem.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    // Injetamos a URL da logo no formData antes de enviar para a action
    if (logoUrl) formData.set("logoUrl", logoUrl);
    
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
      
      {/* BLOCO 0: LOGOMARCA (O novo astro!) */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 text-orange-600">
            <ImageIcon size={20} />
            <h2 className="font-bold text-lg">Logomarca do Negócio</h2>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden bg-slate-50">
                {logoUrl ? (
                    <>
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                        <button 
                            type="button" 
                            onClick={() => setLogoUrl("")}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </>
                ) : (
                    <div className="text-center p-2">
                        <Upload className="mx-auto text-slate-300 mb-1" size={24} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Sem Logo</span>
                    </div>
                )}
            </div>

            <div className="flex-1">
                <p className="text-sm text-slate-500 mb-3">
                    Sua logo aparecerá no topo de todos os orçamentos e nos links compartilhados.
                </p>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleLogoUpload} 
                    className="hidden" 
                    accept="image/*" 
                />
                <button 
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                    {logoUrl ? "Alterar Logo" : "Escolher Imagem"}
                </button>
            </div>
        </div>
      </section>

      {/* BLOCO 1: IDENTIDADE */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 text-blue-600">
            <Building2 size={20} />
            <h2 className="font-bold text-lg">Identidade do Negócio</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nome Fantasia / Empresa *</label>
                <input required name="companyName" defaultValue={initialData?.companyName || ""} placeholder="Ex: Silva Reformas" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">CPF ou CNPJ</label>
                <input name="cpfCnpj" defaultValue={initialData?.cpfCnpj || ""} placeholder="000.000.000-00" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Endereço Comercial</label>
                <input name="address" defaultValue={initialData?.address || ""} placeholder="Rua, Número, Bairro, Cidade" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
            </div>
        </div>
      </section>

      {/* BLOCO 2: CONTATO */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 text-green-600">
            <Contact size={20} />
            <h2 className="font-bold text-lg">Contatos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp (com DDD) *</label>
                <input required name="phone" defaultValue={initialData?.phone || ""} placeholder="11999999999" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
            </div>
        </div>
      </section>

      {/* BLOCO 3: FINANCEIRO (PIX) */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 text-purple-600">
            <Wallet size={20} />
            <h2 className="font-bold text-lg">Dados de Recebimento</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Chave PIX</label>
                <input name="pixKey" defaultValue={initialData?.pixKey || ""} placeholder="CPF, E-mail ou Telefone" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Titular</label>
                <input name="pixHolder" defaultValue={initialData?.pixHolder || ""} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Assinatura / Despedida</label>
                <textarea name="signature" defaultValue={initialData?.signature || "Agradeço a preferência e fico à disposição!"} className="w-full p-3 border border-slate-200 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 outline-none font-medium resize-none" />
            </div>
        </div>
      </section>

      <button disabled={loading || isUploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:scale-95 uppercase tracking-widest text-sm">
        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
        Salvar Tudo
      </button>
    </form>
  );
}