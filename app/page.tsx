"use client";

import { supabase } from "../src/lib/supabase";
import { useState } from "react";

export default function Home() {
  const [nome, setNome] = useState("");
  const [chamado, setChamado] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmado) {
      alert("Você precisa marcar o campo confirmando o recebimento.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("recebimentos").insert([
      {
        nome,
        email: chamado, // Mapeado para a sua coluna 'email' do banco conforme o código original
        confirmado,
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      console.error("Erro Supabase:", error);
      alert(`Erro ao salvar:\n${error.message}`);
      return;
    }

    alert("Recebimento registrado com sucesso!");
    
    setNome("");
    setChamado("");
    setConfirmado(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Confirmação de Recebimento
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Insira os dados para validar a entrega.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-sm"
              placeholder="Digite seu nome"
            />
          </div>

          {/* Nº de Chamado */}
          <div>
            <label htmlFor="chamado" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nº de Chamado
            </label>
            <input
              id="chamado"
              type="text"
              required
              value={chamado}
              onChange={(e) => setChamado(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-sm"
              placeholder="Ex: #12345"
            />
          </div>

          {/* Checkbox Card */}
          <div className="relative flex items-start p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-colors mt-5">
            <div className="flex h-5 items-center">
              <input
                id="confirmado"
                type="checkbox"
                checked={confirmado}
                onChange={(e) => setConfirmado(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
            <div className="ml-3 text-sm leading-5">
              <label htmlFor="confirmado" className="font-medium text-slate-700 cursor-pointer select-none">
                Confirmo o recebimento
              </label>
              <p className="text-xs text-slate-400">Declaro que o material foi entregue.</p>
            </div>
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-sm shadow-slate-950/10 text-sm active:scale-[0.99] mt-2"
          >
            {isSubmitting ? "Enviando..." : "Confirmar"}
          </button>
        </form>
      </div>
    </main>
  );
}