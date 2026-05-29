"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface UsuarioData {
  idUsuario: number;
  nombreCompleto: string;
  emailCorporativo: string;
  rol: string;
  departamento: string;
  estatus: boolean;
  fechaRegistro: string;
}

export default function UsuariosPage() {
  const [user, setUser] = useState<{ nombreCompleto: string; rol: string; emailCorporativo: string; departamento: string } | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  // Estados del formulario de registro
  const [formRegistro, setFormRegistro] = useState({
    nombreCompleto: "",
    emailCorporativo: "",
    ssoIdentificador: "",
    rol: "Empleado",
    departamento: ""
  });

  // Spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightBackground = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(25, 75, 100, 0.25), transparent 80%)`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const token = sessionStorage.getItem("evaluma_session_token");
    const userData = sessionStorage.getItem("evaluma_user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.rol !== "Administrador") {
        router.push("/dashboard"); // Expulsar si no es admin
        return;
      }
      setUser(parsedUser);
      fetchUsuarios(token);
    } catch (error) {
      router.push("/login");
    }
  }, [router]);

  const fetchUsuarios = async (token: string) => {
    try {
      const response = await fetch("https://localhost:7173/api/Auth/usuarios", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Fallo al obtener el directorio de usuarios.");
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setError(null);

    const token = sessionStorage.getItem("evaluma_session_token");

    try {
      // Ajusta este endpoint según la ruta exacta de tu controlador de registro en .NET
      const response = await fetch("https://localhost:7173/api/Auth/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nombreCompleto: formRegistro.nombreCompleto.trim(),
          emailCorporativo: formRegistro.emailCorporativo.trim(),
          ssoIdentificador: formRegistro.ssoIdentificador.trim(),
          rol: formRegistro.rol,
          departamento: formRegistro.departamento.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.mensaje || "Error al registrar el usuario en la base de datos.");
      }

      // Limpiar formulario, cerrar modal y recargar tabla
      setFormRegistro({ nombreCompleto: "", emailCorporativo: "", ssoIdentificador: "", rol: "Empleado", departamento: "" });
      setModalOpen(false);
      fetchUsuarios(token!);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado durante el registro.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F7F9]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C3E0E6] border-t-[#13B4CE]"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F3F7F9] text-[#194B64] overflow-hidden">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(19,180,206,0.14),_transparent_28%),linear-gradient(135deg,rgba(25,75,100,0.04)_0%,transparent_38%,rgba(19,180,206,0.05)_100%)] z-0" />
      <motion.div className="pointer-events-none fixed inset-0 z-10" style={{ background: spotlightBackground }} />

      <div className="relative z-20 flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-[#C3E0E6] bg-white/80 px-6 py-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-[90rem] items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C3E0E6] bg-[#F3F7F9]">
                <Image src="/sources/logo.png" alt="EVALUMA" width={28} height={28} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8EACB4]">EVALUMA</p>
                <p className="text-sm font-semibold">Gestión Corporativa</p>
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{user?.nombreCompleto}</p>
              <p className="text-xs font-medium text-[#5D7E88]">{user?.rol} • {user?.departamento}</p>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[90rem] flex-1 p-6 py-10">
          <motion.nav 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8EACB4]"
          >
            <Link href="/dashboard" className="group flex items-center gap-2 transition-colors hover:text-[#13B4CE]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true">
                <path d="M19 12H5M5 12L12 5M5 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Dashboard
            </Link>
            <span className="text-[#C3E0E6]">/</span>
            <span className="text-[#194B64]">Directorio de Usuarios</span>
          </motion.nav>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#194B64]">Directorio Activo</h1>
              <p className="mt-2 text-sm text-[#5D7E88]">Gestiona los accesos y roles del personal en el sistema transaccional.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#194B64] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#194B64]/20 transition-colors hover:bg-[#0f3b51]"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Registrar Empleado
            </motion.button>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
              {error}
            </motion.div>
          )}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-[#C3E0E6] bg-white p-6 shadow-xl shadow-slate-200/60 lg:p-8"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-[#C3E0E6] text-xs font-bold uppercase tracking-wider text-[#8EACB4]">
                    <th className="pb-4 pl-2">ID</th>
                    <th className="pb-4">Nombre Completo</th>
                    <th className="pb-4">Correo Corporativo</th>
                    <th className="pb-4">Departamento</th>
                    <th className="pb-4 text-center">Rol</th>
                    <th className="pb-4 text-center">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {usuarios.map((u) => (
                    <tr key={u.idUsuario} className="group hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 pl-2 font-mono text-xs text-[#8EACB4] transition-colors group-hover:text-[#194B64]">{u.idUsuario}</td>
                      <td className="py-4 font-semibold text-[#194B64]">{u.nombreCompleto}</td>
                      <td className="py-4 text-[#5D7E88]">{u.emailCorporativo}</td>
                      <td className="py-4 text-[#5D7E88]">{u.departamento || "N/A"}</td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                          u.rol === "Administrador" ? "bg-purple-50 text-purple-700 ring-purple-700/20" : u.rol === "Auditor" ? "bg-amber-50 text-amber-700 ring-amber-700/20" : "bg-blue-50 text-blue-700 ring-blue-700/20"
                        }`}>{u.rol}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${u.estatus ? "bg-green-100 text-green-800" : "bg-rose-100 text-rose-800"}`}>
                          {u.estatus ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {usuarios.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-sm text-[#8EACB4]">No se encontraron registros de usuarios.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.section>
        </main>
      </div>

      {/* Modal de Registro */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 z-50 bg-[#194B64]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-[#C3E0E6] bg-white p-6 shadow-2xl sm:p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-[#194B64]">Nuevo Usuario</h2>
                <button onClick={() => setModalOpen(false)} className="rounded-lg p-2 text-[#8EACB4] transition-colors hover:bg-slate-100 hover:text-[#194B64]">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleRegistro} className="flex flex-col gap-5">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8EACB4]">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={formRegistro.nombreCompleto}
                    onChange={(e) => setFormRegistro({ ...formRegistro, nombreCompleto: e.target.value })}
                    className="w-full rounded-xl border border-[#C3E0E6] bg-[#F3F7F9] px-4 py-3 text-sm text-[#194B64] outline-none transition-all focus:border-[#13B4CE] focus:bg-white focus:ring-4 focus:ring-[#13B4CE]/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8EACB4]">Correo Corporativo</label>
                  <input
                    type="email"
                    required
                    value={formRegistro.emailCorporativo}
                    onChange={(e) => setFormRegistro({ ...formRegistro, emailCorporativo: e.target.value })}
                    className="w-full rounded-xl border border-[#C3E0E6] bg-[#F3F7F9] px-4 py-3 text-sm text-[#194B64] outline-none transition-all focus:border-[#13B4CE] focus:bg-white focus:ring-4 focus:ring-[#13B4CE]/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8EACB4]">Identificador SSO</label>
                  <input
                    type="text"
                    required
                    value={formRegistro.ssoIdentificador}
                    onChange={(e) => setFormRegistro({ ...formRegistro, ssoIdentificador: e.target.value })}
                    className="w-full rounded-xl border border-[#C3E0E6] bg-[#F3F7F9] px-4 py-3 text-sm text-[#194B64] outline-none transition-all focus:border-[#13B4CE] focus:bg-white focus:ring-4 focus:ring-[#13B4CE]/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8EACB4]">Departamento</label>
                  <input
                    type="text"
                    required
                    value={formRegistro.departamento}
                    onChange={(e) => setFormRegistro({ ...formRegistro, departamento: e.target.value })}
                    className="w-full rounded-xl border border-[#C3E0E6] bg-[#F3F7F9] px-4 py-3 text-sm text-[#194B64] outline-none transition-all focus:border-[#13B4CE] focus:bg-white focus:ring-4 focus:ring-[#13B4CE]/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8EACB4]">Nivel de Acceso</label>
                  <select
                    value={formRegistro.rol}
                    onChange={(e) => setFormRegistro({ ...formRegistro, rol: e.target.value })}
                    className="w-full rounded-xl border border-[#C3E0E6] bg-[#F3F7F9] px-4 py-3 text-sm text-[#194B64] outline-none transition-all focus:border-[#13B4CE] focus:bg-white focus:ring-4 focus:ring-[#13B4CE]/10"
                  >
                    <option value="Empleado">Empleado</option>
                    <option value="Auditor">Auditor</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-[#C3E0E6] bg-white px-5 py-3 text-sm font-semibold text-[#5D7E88] transition-colors hover:bg-[#F3F7F9] hover:text-[#194B64]"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isRegistering}
                    className="rounded-xl bg-[#13B4CE] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#13B4CE]/20 transition-colors hover:bg-[#0ea3bb] disabled:opacity-60"
                  >
                    {isRegistering ? "Procesando..." : "Confirmar Registro"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}