"use client";

import { useState } from "react";
import { supabase } from "../../src/lib/supabase";
import * as XLSX from "xlsx";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);

  async function exportarExcel() {
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
  "E-mail": item.email,
  Material: item.material,
  Núcleo: item.nucleo,
  Cargo: item.cargo,
  Confirmação: item.confirmado ? "Sim" : "Não",
  RecebidoEm: new Date(item.data_recebimento).toLocaleString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ),
}));
const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Recebimentos"
    );

    XLSX.writeFile(
      workbook,
      "recebimentos.xlsx"
    );

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Administração
        </h1>

        <button
          onClick={exportarExcel}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
        >
          {loading
            ? "Gerando..."
            : "Exportar Excel"}
        </button>
      </div>
    </main>
  );
}