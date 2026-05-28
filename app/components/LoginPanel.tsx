"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ssoLoading, setSsoLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSsoLogin = () => {
    setError("SSO corporativo disponible mediante el proveedor de identidad configurado.");
    setSsoLoading(false);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.evaluma.com/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Credenciales inválidas");
        }
        if (response.status === 500) {
          throw new Error("Fallo del servidor");
        }
        throw new Error("Fallo del servidor. Intente más tarde.");
      }

      const data = await response.json();
      const token = typeof data?.token === "string" ? data.token : "";

      if (!token) {
        throw new Error("Respuesta de autenticación inválida");
      }

      sessionStorage.setItem("evaluma_session_token", token);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof TypeError) {
        setError("Error de red. Verifique su conexión o CORS.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error de red. Verifique su conexión o CORS.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 14, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-xl rounded-3xl border border-[#C3E0E6] bg-white p-8 shadow-2xl shadow-slate-200/70 backdrop-blur-xl sm:p-10"
    >
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C3E0E6] bg-[#F3F7F9]">
          <Image src="/sources/logo.png" alt="Logo EVALUMA" width={42} height={42} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8EACB4]">Acceso seguro</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#194B64]">Portal de autenticación EVALUMA</h2>
        </div>
      </div>
      <div className="mb-8">
        <p className="max-w-lg text-sm leading-6 text-[#5D7E88]">
          Inicia sesión con SSO corporativo o con tu correo institucional para acceder al portal documentado en la propuesta escrita.
        </p>
      </div>

      <button
        type="button"
        onClick={handleSsoLogin}
        disabled={loading || ssoLoading}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-[#194B64] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#194B64]/20 transition hover:bg-[#0f3b51] focus:outline-none focus:ring-2 focus:ring-[#13B4CE]/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {ssoLoading ? "Redirigiendo a SSO..." : "Ingresar con SSO Corporativo"}
      </button>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#C3E0E6]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-[0.28em] text-[#8EACB4]">
          <span className="bg-white px-3">o continuar con</span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Correo corporativo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-[#C3E0E6] bg-[#F3F7F9] px-4 py-3.5 text-sm text-[#194B64] outline-none transition placeholder:text-[#8EACB4] focus:border-[#13B4CE] focus:ring-2 focus:ring-[#13B4CE]/20 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-[#C3E0E6] bg-[#F3F7F9] px-4 py-3.5 text-sm text-[#194B64] outline-none transition placeholder:text-[#8EACB4] focus:border-[#13B4CE] focus:ring-2 focus:ring-[#13B4CE]/20 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-[#13B4CE] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0ea3bb] focus:outline-none focus:ring-2 focus:ring-[#13B4CE]/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Autenticando..." : "Ingresar"}
        </button>
        {error && (
          <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert" aria-live="polite">
            {error}
          </div>
        )}
      </form>
    </motion.div>
  );
}
