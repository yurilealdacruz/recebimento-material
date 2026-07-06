"use client";

import { useState } from "react";
import { supabase } from "../../src/lib/supabase";
import * as XLSX from "xlsx";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [senha, setSenha] = useState("");

  // Defina a sua senha simples aqui
  const SENHA_CORRETA = "Cimatec@123";

  async function exportarExcel() {
    // Validação simples de senha
    if (senha !== SENHA_CORRETA) {
      alert("Senha incorreta! Acesso negado para exportação.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("recebimentos")
      .select("*");

    if (error) {
      alert("Erro ao buscar dados.");
      console.error(error);
      setLoading(false);
      return;
    }

    const dadosFormatados = data?.map((item) => ({
      Nome: item.nome,
      "Nº de Chamado": item.email,
      "Confirmação": item.confirmado ? "Sim" : "Não",
      "Recebido em": new Date(item.data_recebimento).toLocaleString(
        "pt-BR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    })) || [];

    const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);

    // --- DEIXAR A PLANILHA BONITA (Ajuste automático de largura das colunas) ---
    // Isso evita que o e-mail ou a data fiquem cortados com "###" ou textos sobrepostos
    const largurasColunas = Object.keys(dadosFormatados[0] || {}).map((key) => {
      // Descobre o tamanho do maior texto naquela coluna
      const tamanhoMaximo = Math.max(
        key.length,
        ...dadosFormatados.map((item) => String(item[key as keyof typeof item] || "").length)
      );
      return { wch: tamanhoMaximo + 3 }; // Adiciona uma folga de 3 caracteres de espaçamento
    });
    worksheet["!cols"] = largurasColunas;
    // --------------------------------------------------------------------------

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recebimentos");

    XLSX.writeFile(workbook, "recebimentos.xlsx");

    setLoading(false);
    setSenha(""); // Limpa o campo de senha após o sucesso
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-sm">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Painel Administrativo
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Insira a chave de acesso para exportar o relatório.
          </p>
        </header>

        <div className="space-y-4">
          {/* Campo de Senha */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Senha de Segurança
            </label>
            <input
              id="password"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          {/* Botão de Exportar */}
          <button
            onClick={exportarExcel}
            disabled={loading || !senha}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-sm shadow-slate-950/10 text-sm active:scale-[0.99]"
          >
            {loading ? "Processando..." : "Exportar para Excel"}
          </button>
        </div>
      </div>
    </main>
  );
}