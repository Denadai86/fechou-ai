"use client";

import { useState } from "react";
import { Save, Trash2, Plus, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { updateProposal } from "./actions";

const toNum = (val: any) => Number(val);

export function EditForm({ initialData }: any) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [items, setItems] = useState(initialData.items.map((i: any) => ({
    id: i.id,
    description: i.description,
    quantity: toNum(i.quantity),
    unitPrice: toNum(i.unitPrice),
  })));

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { id: `temp-${Date.now()}`, description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_: any, i: number) => i !== index));
  };

  const currentTotal = items.reduce((acc: number, item: any) => acc + (Number(item.quantity) * Number(item.unitPrice)), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProposal({
        proposalId: initialData.id,
        title,
        description,
        items: items.map(({ description, quantity, unitPrice }: any) => ({
          description, quantity: Number(quantity), unitPrice: Number(unitPrice)
        }))
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar as alterações.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md border border-slate-200">
      <div className="mb-8 space-y-6">
        <div>
          <label className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">Título do Orçamento</label>
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 border-2 border-slate-200 rounded-xl font-bold text-xl text-slate-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">Descrição do Serviço</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            className="w-full p-4 border-2 border-slate-200 rounded-xl font-medium text-lg text-slate-950 focus:border-blue-500 outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-black text-slate-900 text-lg mb-4 uppercase tracking-wider">Itens Detalhados</h3>
        <div className="border-2 border-slate-100 rounded-2xl overflow-hidden mb-6 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-4 text-xs font-bold uppercase">Descrição</th>
                <th className="p-4 text-xs font-bold uppercase w-24 text-center">Qtd</th>
                <th className="p-4 text-xs font-bold uppercase w-32">V. Unit</th>
                <th className="p-4 text-xs font-bold uppercase w-32 text-right">Subtotal</th>
                <th className="p-4 w-14"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item: any, index: number) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-3">
                    <input 
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-950 font-bold focus:border-blue-500 outline-none"
                      required
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="number" min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-center text-slate-950 font-bold focus:border-blue-500 outline-none"
                      required
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="number" min="0" step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-950 font-bold focus:border-blue-500 outline-none"
                      required
                    />
                  </td>
                  <td className="p-4 text-right font-black text-slate-900">
                    {(item.quantity * item.unitPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="p-3 text-center">
                    <button type="button" onClick={() => removeItem(index)} className="text-slate-400 hover:text-red-600 p-2 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={addItem} className="flex items-center gap-2 bg-slate-100 text-slate-900 font-black px-6 py-3 rounded-xl hover:bg-slate-200 transition-all border-2 border-slate-200 uppercase text-xs">
          <Plus size={16} /> Adicionar Item
        </button>
      </div>

      <div className="border-t-4 border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-2xl font-black text-slate-900 bg-blue-50 px-6 py-3 rounded-2xl border-2 border-blue-100">
           Total: <span className="text-blue-600">{currentTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Link href={`/dashboard/orcamento/${initialData.id}`} className="flex-1 md:flex-none">
            <button type="button" disabled={loading} className="w-full px-8 py-4 rounded-2xl font-black border-2 border-slate-200 text-slate-500 hover:bg-slate-50 uppercase text-sm transition-all">
              <ArrowLeft size={18} className="inline mr-2" /> Cancelar
            </button>
          </Link>
          <button 
            type="submit" 
            disabled={loading || items.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 uppercase text-sm transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Salvar
          </button>
        </div>
      </div>
    </form>
  );
}