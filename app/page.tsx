import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <header className="border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-slate-950">EVALUMA</div>
          <Link href="/login" className="px-5 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition">
            Acceder
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <section className="text-center mb-24">
          <h1 className="text-5xl font-extrabold text-slate-950 mb-6">
            Portal Corporativo Transaccional B2B
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Solución robusta para sectores altamente regulados. Seguridad y cumplimiento garantizados en cada transacción.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-12">
          <div className="p-8 border border-slate-200 rounded-lg">
            <h2 className="text-2xl font-semibold text-slate-950 mb-4">0% pérdida de datos ante fallos de red</h2>
            <p className="text-slate-600">
              Arquitectura resiliente diseñada para asegurar la integridad de su información crítica bajo cualquier condición de red.
            </p>
          </div>
          <div className="p-8 border border-slate-200 rounded-lg">
            <h2 className="text-2xl font-semibold text-slate-950 mb-4">Trazabilidad legal con auditoría inmutable</h2>
            <p className="text-slate-600">
              Cumplimiento normativo estricto con registros inalterables y trazabilidad completa de cada operación realizada.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        &copy; 2026 EVALUMA. Todos los derechos reservados.
      </footer>
    </div>
  );
}
