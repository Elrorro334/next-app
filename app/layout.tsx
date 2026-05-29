import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EVALUMA | Portal corporativo transaccional",
  description: "Landing page y autenticación corporativa para cumplimiento normativo, auditoría y resiliencia técnica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-[#F3F7F9] text-[#194B64] antialiased selection:bg-[#13B4CE]/30 selection:text-[#194B64] relative`}
      >
        <div className="pointer-events-none fixed inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNDM0UwRTYiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />

        <main className="relative z-10 flex w-full flex-1 flex-col">
          {children}
        </main>

        <footer className="relative z-20 mt-auto w-full border-t border-[#C3E0E6]/50 bg-white/70 backdrop-blur-xl">
          <div className="mx-auto w-full max-w-[90rem] px-6 py-16 lg:px-10">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
              <div className="md:col-span-2">
                <span className="text-2xl font-extrabold tracking-[0.2em] text-[#194B64]">EVALUMA</span>
                <p className="mt-6 max-w-md text-base leading-7 text-[#5D7E88]">
                  Plataforma corporativa de evaluación inmutable. Trazabilidad criptográfica, control transaccional y resiliencia asíncrona para auditorías de alto nivel.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#13B4CE]">Plataforma</h3>
                <ul className="mt-6 space-y-4 text-sm font-medium text-[#5D7E88]">
                  <li><a href="#" className="transition-colors hover:text-[#194B64]">Motor Asíncrono</a></li>
                  <li><a href="#" className="transition-colors hover:text-[#194B64]">Auditoría Legal</a></li>
                  <li><a href="#" className="transition-colors hover:text-[#194B64]">Seguridad SSO</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#13B4CE]">Soporte</h3>
                <ul className="mt-6 space-y-4 text-sm font-medium text-[#5D7E88]">
                  <li><a href="#" className="transition-colors hover:text-[#194B64]">Documentación API</a></li>
                  <li><a href="#" className="transition-colors hover:text-[#194B64]">Estado del Sistema</a></li>
                  <li><a href="#" className="transition-colors hover:text-[#194B64]">Contacto TI</a></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-16 flex flex-col items-center justify-between border-t border-[#C3E0E6]/50 pt-8 sm:flex-row">
              <p className="text-xs font-semibold text-[#8EACB4]">
                © {new Date().getFullYear()} Rodnix. Todos los derechos reservados.
              </p>
              <div className="mt-4 flex gap-6 text-xs font-bold text-[#8EACB4] sm:mt-0">
                <span>v1.0.0-stable</span>
                <span>Latencia: ~45ms</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}