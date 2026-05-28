export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">EVALUMA</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Acceso confirmado</h1>
        <p className="mt-4 text-base leading-7 text-slate-300">
          El token de sesión fue almacenado en sessionStorage y la navegación posterior a autenticación quedó habilitada.
        </p>
      </section>
    </main>
  );
}
