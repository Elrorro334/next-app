"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

function AsyncIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[#194B64]" aria-hidden="true">
      <path d="M4 7h10a5 5 0 0 1 0 10H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 4 4 7l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 17h-3a5 5 0 0 1-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[#194B64]" aria-hidden="true">
      <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 14.5v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function AuditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[#194B64]" aria-hidden="true">
      <path d="M6 4h8l4 4v12H6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 4v4h4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 13h6M9 16h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const features = [
    {
      title: "Motor asíncrono en segundo plano",
      desc: "Procesa el progreso de la evaluación sin bloquear la interfaz y reduce el riesgo de pérdida de datos por fallos de red.",
      icon: <AsyncIcon />,
    },
    {
      title: "Control transaccional aislado",
      desc: "Cada microacción se guarda de forma independiente para cancelar solo el evento fallido y conservar el avance previo.",
      icon: <LockIcon />,
    },
    {
      title: "Bitácora criptográfica inmutable",
      desc: "Genera trazabilidad legal con registros append-only, hash SHA-256 y evidencia apta para auditoría externa.",
      icon: <AuditIcon />,
    },
  ];

  const objectives = [
    "Garantizar 0% de pérdida de datos mediante guardado asíncrono en segundo plano.",
    "Reducir en 90% los tickets de soporte derivados de fallos de red o congelamiento de pantalla.",
    "Alcanzar 100% de cumplimiento regulatorio con evidencias cronológicas exportables en CSV y PDF.",
    "Asegurar la inmutabilidad de la auditoría con bitácoras de solo inserción y trazabilidad exacta.",
  ];

  const actors = [
    {
      title: "Empleado",
      desc: "Completa simulaciones y certificaciones con checkpoints automáticos y reanudación exacta tras fallos técnicos.",
    },
    {
      title: "Auditor o Gerente de RRHH",
      desc: "Consulta paneles de cumplimiento y descarga reportes con validez legal para auditorías internas o externas.",
    },
    {
      title: "Administrador del Sistema",
      desc: "Supervisa RAM, CPU, colas de mensajes y salud operativa del motor asíncrono en tiempo real.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F3F7F9] text-[#194B64]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(19,180,206,0.14),_transparent_28%),linear-gradient(135deg,rgba(25,75,100,0.04)_0%,transparent_38%,rgba(19,180,206,0.05)_100%)]" />
      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-12 px-6 py-8 lg:px-10 xl:py-12">
        <header className="flex items-center justify-between rounded-3xl border border-[#C3E0E6] bg-white/80 px-5 py-4 shadow-sm shadow-slate-200/50 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C3E0E6] bg-[#F3F7F9] shadow-sm">
              <Image src="/sources/logo.png" alt="Logo EVALUMA" width={42} height={42} priority />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8EACB4]">EVALUMA</p>
              <p className="text-sm font-medium text-[#194B64]">Evaluación Corporativa Inmutable</p>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-[#194B64] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#194B64]/15 transition hover:bg-[#0f3b51]"
          >
            Acceder
          </Link>
        </header>

        <div className="flex flex-col gap-10">
          <motion.div
            initial={{ opacity: 1, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C3E0E6] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8EACB4] shadow-sm">
              Portal corporativo transaccional B2B
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-[#194B64] sm:text-6xl lg:text-7xl">
              Motor asíncrono para certificación corporativa con trazabilidad legal absoluta.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5D7E88] sm:text-xl">
              EVALUMA protege el progreso del empleado con guardado asíncrono, checkpoints automáticos, control transaccional aislado y bitácoras criptográficas para auditoría externa.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-[#13B4CE] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#13B4CE]/25 transition hover:bg-[#0ea3bb] focus:outline-none focus:ring-2 focus:ring-[#13B4CE]/30"
              >
                Ingresar con SSO Corporativo
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-[#C3E0E6] bg-white px-6 py-3 text-sm font-semibold text-[#194B64] transition hover:border-[#13B4CE] hover:text-[#13B4CE]"
              >
                Ver propuesta y objetivos
              </a>
            </div>
            <dl className="mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#C3E0E6] bg-white p-4 shadow-sm">
                <dt className="text-sm text-[#8EACB4]">Meta técnica</dt>
                <dd className="mt-2 text-2xl font-semibold text-[#194B64]">0%</dd>
              </div>
              <div className="rounded-2xl border border-[#C3E0E6] bg-white p-4 shadow-sm">
                <dt className="text-sm text-[#8EACB4]">Cumplimiento</dt>
                <dd className="mt-2 text-2xl font-semibold text-[#194B64]">100%</dd>
              </div>
              <div className="rounded-2xl border border-[#C3E0E6] bg-white p-4 shadow-sm">
                <dt className="text-sm text-[#8EACB4]">Reducción soporte</dt>
                <dd className="mt-2 text-2xl font-semibold text-[#194B64]">90%</dd>
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
                className="group rounded-2xl border border-[#C3E0E6] bg-white p-6 shadow-xl shadow-slate-200/60 transition hover:border-[#13B4CE]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#C3E0E6]/60 ring-1 ring-inset ring-[#13B4CE]/40">
                  {feature.icon}
                </div>
                <h2 className="text-xl font-semibold text-[#194B64]">{feature.title}</h2>
                <p className="mt-3 leading-7 text-[#5D7E88]">{feature.desc}</p>
              </motion.article>
            ))}
          </section>

          <section className="grid gap-4 rounded-3xl border border-[#C3E0E6] bg-white p-6 shadow-xl shadow-slate-200/60 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8EACB4]">Contexto del proyecto</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#194B64]">Problema, justificación y alcance</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5D7E88]">
                La plataforma reemplaza flujos síncronos tradicionales por un motor que guarda cada evento en segundo plano, protege ante microcortes de red y entrega evidencias cronológicas a Compliance, Recursos Humanos y Ciberseguridad.
              </p>
            </div>
            <div className="grid gap-3">
              {objectives.slice(0, 2).map((item) => (
                <div key={item} className="rounded-2xl border border-[#C3E0E6] bg-[#F3F7F9] p-4 text-sm leading-6 text-[#5D7E88]">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#C3E0E6] bg-white p-6 shadow-xl shadow-slate-200/60">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8EACB4]">Objetivos específicos</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                {objectives.map((objective) => (
                  <li key={objective} className="flex gap-3 rounded-2xl border border-[#C3E0E6] bg-[#F3F7F9] p-4 text-[#5D7E88]">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#13B4CE]/10 text-[#13B4CE]">
                      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d="m5 12 4 4 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-[#C3E0E6] bg-white p-6 shadow-xl shadow-slate-200/60">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8EACB4]">Actores y casos de uso</p>
              <div className="mt-4 grid gap-3">
                {actors.map((actor) => (
                  <article key={actor.title} className="rounded-2xl border border-[#C3E0E6] bg-[#F3F7F9] p-4">
                    <h3 className="text-base font-semibold text-[#194B64]">{actor.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#5D7E88]">{actor.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
