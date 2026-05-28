"use client";

import { motion } from "framer-motion";
import LoginPanel from "./components/LoginPanel";

export default function Home() {
  const features = [
    {
      title: "Control transaccional aislado",
      desc: "Cada evaluación opera en un flujo independiente para reducir riesgo operativo y mantener integridad de la información.",
    },
    {
      title: "Guardado asíncrono",
      desc: "El motor persiste la evidencia aun ante interrupciones de red, asegurando continuidad y 0% data loss.",
    },
    {
      title: "Auditoría inmutable",
      desc: "Bitácoras selladas para trazabilidad legal, revisión forense y cumplimiento normativo sin ambigüedad.",
    },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.16),_transparent_34%),linear-gradient(180deg,#020617_0%,#0f172a_46%,#020617_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-16 px-6 py-8 lg:px-10 xl:flex-row xl:items-center xl:py-12">
        <div className="flex flex-1 flex-col gap-10">
          <motion.div
            initial={{ opacity: 1, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-300 shadow-lg shadow-slate-950/30 backdrop-blur">
              Portal corporativo transaccional B2B
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Blindaje normativo con resiliencia técnica para cada evaluación.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              EVALUMA protege la continuidad operativa con un motor asíncrono, control transaccional aislado y bitácoras inmutables que refuerzan la trazabilidad legal en entornos corporativos exigentes.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#login"
                className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Ingresar al portal
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
              >
                Ver capacidades clave
              </a>
            </div>
            <dl className="mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
                <dt className="text-sm text-slate-400">Data loss</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">0%</dd>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
                <dt className="text-sm text-slate-400">Auditoría</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">Inmutable</dd>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
                <dt className="text-sm text-slate-400">Operación</dt>
                <dd className="mt-2 text-2xl font-semibold text-white">Asíncrona</dd>
              </div>
            </dl>
          </motion.div>

          <section id="features" className="grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 1, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-60px" }}
                className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/25 backdrop-blur transition hover:border-blue-500/40 hover:bg-slate-900"
              >
                <div className="mb-5 h-11 w-11 rounded-xl bg-blue-500/15 ring-1 ring-inset ring-blue-500/30" />
                <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
                <p className="mt-3 leading-7 text-slate-300">{feature.desc}</p>
              </motion.article>
            ))}
          </section>
        </div>

        <div id="login" className="flex w-full flex-1 justify-center xl:max-w-xl">
          <LoginPanel />
        </div>
      </section>
    </main>
  );
}
