"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-950/85 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-10"
    >
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">Acceso seguro</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Portal de autenticación EVALUMA</h2>
        <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">
          Accede mediante SSO corporativo o utiliza tu correo institucional con respaldo transaccional y validación segura.
        </p>
      </div>

      <button
        type="button"
        onClick={handleSsoLogin}
        disabled={loading || ssoLoading}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {ssoLoading ? "Redirigiendo a SSO..." : "Ingresar con SSO Corporativo"}
      </button>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-[0.28em] text-slate-500">
          <span className="bg-slate-950 px-3">o continuar con</span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Correo corporativo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Autenticando..." : "Ingresar"}
        </button>
        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200" role="alert" aria-live="polite">
            {error}
          </div>
        )}
      </form>
    </motion.div>
  );
}
