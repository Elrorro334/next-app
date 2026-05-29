"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function LoginPanel() {
  const [email, setEmail] = useState("");
  const [ssoId, setSsoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Valores de movimiento a 60FPS para la luz del cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("1. Formulario interceptado por React exitosamente.");
    console.log("2. Credenciales capturadas:", { email, ssoId });

    setLoading(true);
    setError(null);

    try {
      console.log("3. Intentando conexión con la API (.NET)...");
      const response = await fetch("https://localhost:7173/api/Auth/login/sso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailCorporativo: email.trim(),
          ssoIdentificador: ssoId.trim()
        }),
      });

      console.log("4. Respuesta del servidor recibida. Status:", response.status);

      const data = await response.json().catch(() => null);
      console.log("5. Cuerpo de la respuesta (JSON):", data);

      if (!response.ok) {
        throw new Error(data?.Error || data?.error || "Credenciales corporativas inválidas.");
      }

      const token = typeof data?.Token === "string" ? data.Token : typeof data?.token === "string" ? data.token : "";

      if (!token) {
        throw new Error("El servidor no devolvió un token válido.");
      }

      console.log("6. Autenticación exitosa. Guardando sesión...");
      sessionStorage.setItem("evaluma_session_token", token);
      
      if (data?.Usuario || data?.usuario) {
        sessionStorage.setItem("evaluma_user", JSON.stringify(data?.Usuario || data?.usuario));
      }

      console.log("7. Redirigiendo al dashboard...");
      router.push("/dashboard");
      
    } catch (err) {
      console.error("X. Error capturado en el bloque catch:", err);
      
      if (err instanceof TypeError) {
        setError("Servidor inalcanzable. Verifique si el backend está corriendo y CORS está configurado.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al intentar autenticar.");
      }
    } finally {
      setLoading(false);
      console.log("8. Fin del ciclo de petición.");
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#F3F7F9] p-6 text-[#194B64] overflow-hidden">
      
      {/* Fondo base estático */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(19,180,206,0.14),_transparent_28%),linear-gradient(135deg,rgba(25,75,100,0.04)_0%,transparent_38%,rgba(19,180,206,0.05)_100%)] z-0" />
      
      {/* Rastro del mouse INTENSO */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(25, 75, 100, 0.25), transparent 80%)`,
        }}
      />

      <div className="relative z-20 w-full max-w-xl">
        
        {/* Migas de pan (Breadcrumbs) */}
        <motion.nav 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8EACB4]"
        >
          <Link href="/" className="group flex items-center gap-2 transition-colors hover:text-[#13B4CE]">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true">
              <path d="M19 12H5M5 12L12 5M5 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Inicio
          </Link>
          <span className="text-[#C3E0E6]">/</span>
          <span className="text-[#194B64]">Autenticación</span>
        </motion.nav>

        {/* Tarjeta de Login */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
          className="w-full rounded-[32px] border border-[#C3E0E6] bg-white/80 p-8 shadow-2xl shadow-slate-200/70 backdrop-blur-xl sm:p-10"
        >
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-x-0 -top-6 mx-auto flex w-[90%] max-w-md items-center gap-3 rounded-2xl border border-rose-200 bg-white p-4 shadow-xl shadow-rose-500/20 z-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-rose-600" aria-hidden="true">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="flex-1 text-sm font-medium text-slate-700">{error}</p>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C3E0E6] bg-[#F3F7F9]">
              <Image src="/sources/logo.png" alt="Logo EVALUMA" width={42} height={42} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8EACB4]">Acceso seguro</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#194B64]">Portal de autenticación EVALUMA</h2>
            </div>
          </div>
          
          <div className="mb-8">
            <p className="max-w-lg text-sm leading-6 text-[#5D7E88] font-medium">
              Ingresa tus credenciales corporativas para acceder al sistema de evaluación inmutable.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Correo corporativo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[#C3E0E6] bg-[#F3F7F9]/80 px-5 py-4 text-sm font-medium text-[#194B64] outline-none transition-all placeholder:text-[#8EACB4] focus:border-[#13B4CE] focus:bg-white focus:ring-4 focus:ring-[#13B4CE]/10 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              required
            />
            <input
              type="password"
              placeholder="Identificador SSO"
              value={ssoId}
              onChange={(e) => setSsoId(e.target.value)}
              className="w-full rounded-2xl border border-[#C3E0E6] bg-[#F3F7F9]/80 px-5 py-4 text-sm font-medium text-[#194B64] outline-none transition-all placeholder:text-[#8EACB4] focus:border-[#13B4CE] focus:bg-white focus:ring-4 focus:ring-[#13B4CE]/10 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              required
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-[#194B64] px-5 py-4 text-sm font-bold text-white shadow-xl shadow-[#194B64]/20 transition-colors hover:bg-[#0f3b51] focus:outline-none focus:ring-4 focus:ring-[#13B4CE]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Autenticando en servidor..." : "Ingresar"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}