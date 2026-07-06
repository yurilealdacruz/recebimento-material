"use client";
import { supabase } from "../src/lib/supabase";

import { useState } from "react";

export default function Home() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [nucleo, setNucleo] = useState("");
  const [cargo, setCargo] = useState("");
  const [material, setMaterial] = useState("");
  const [confirmado, setConfirmado] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!confirmado) {
    alert("Você precisa confirmar o recebimento.");
    return;
  }

const { error } = await supabase
  .from("recebimentos")
  .insert([
    {
      nome,
      email,
      nucleo,
      cargo,
      material,
      confirmado,
    },
  ]);

  if (error) {
    console.error("Erro Supabase:", error);

    alert(
      `Erro ao salvar:\n${error.message}`
    );

    return;
  }

  

  alert("Recebimento registrado com sucesso!");

  setNome("");
  setEmail("");
  setNucleo("");
  setCargo("");
  setMaterial("");
  setConfirmado(false);
};

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Confirmação de Recebimento
        </h1>

        <p className="text-slate-600 mb-6">
          Preencha os dados abaixo para confirmar o recebimento do material.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Nome
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-slate-900"
              placeholder="Digite seu nome"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Nº de Chamado
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-slate-900"
              placeholder="Digite seu e-mail"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Quantidade
            </label>

            <input
              type="text"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-slate-900"
              placeholder="Ex.: Técnico de Informática I"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Material Recebido
            </label>

            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-slate-900"
              placeholder="Ex.: Notebook Dell Latitude"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={confirmado}
              onChange={(e) => setConfirmado(e.target.checked)}
              className="w-5 h-5"
            />

            <label className="text-slate-700">
              Confirmo que recebi o material informado acima.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
          >
            Confirmar Recebimento
          </button>
        </form>
      </div>
    </main>
  );
}