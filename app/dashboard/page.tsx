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

export default function DashboardPage() {
  const [user, setUser] = useState<{ nombreCompleto: string; rol: string; emailCorporativo: string; departamento: string } | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState<string | null>(null);
  const [verUsuarios, setVerUsuarios] = useState(false);
  const router = useRouter();

  // 1. TODOS los hooks de Framer Motion se declaran arriba, antes de cualquier "return"
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Extraemos la plantilla del gradiente a una constante
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
      setUser(parsedUser);
      setLoading(false);
    } catch (error) {
      router.push("/login");
    }
  }, [router]);

  const cargarUsuarios = async () => {
    setLoadingUsers(true);
    setErrorUsuarios(null);
    try {
      const token = sessionStorage.getItem("evaluma_session_token");
      const response = await fetch("https://localhost:7173/api/Auth/usuarios", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener el directorio de usuarios corporativos.");
      }

      const data = await response.json();
      setUsuarios(data);
      setVerUsuarios(true);
    } catch (err) {
      if (err instanceof Error) {
        setErrorUsuarios(err.message);
      } else {
        setErrorUsuarios("Error al conectar con el servidor.");
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  // 2. El return condicional ocurre DESPUÉS de declarar todos los hooks
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F7F9]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C3E0E6] border-t-[#13B4CE]"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F3F7F9] text-[#194B64] overflow-hidden">
      
      {/* Fondo base estático */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(19,180,206,0.14),_transparent_28%),linear-gradient(135deg,rgba(25,75,100,0.04)_0%,transparent_38%,rgba(19,180,206,0.05)_100%)] z-0" />
      
      {/* Rastro del mouse intenso */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: spotlightBackground, // Usamos la constante generada por el hook arriba
        }}
      />

      {/* Contenido z-20 */}
      <div className="relative z-20">
        <header className="sticky top-0 z-40 border-b border-[#C3E0E6] bg-white/80 px-6 py-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C3E0E6] bg-[#F3F7F9]">
                <Image src="/sources/logo.png" alt="EVALUMA" width={28} height={28} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8EACB4]">EVALUMA</p>
                <p className="text-sm font-semibold">Portal Corporativo</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{user?.nombreCompleto}</p>
                <p className="text-xs font-medium text-[#5D7E88]">{user?.rol} • {user?.departamento}</p>
              </div>
              <Link href="/dashboard/perfil" className="inline-flex items-center justify-center rounded-xl border border-[#C3E0E6] bg-white px-5 py-2.5 text-sm font-semibold text-[#194B64] shadow-sm transition hover:bg-[#F3F7F9] hover:border-[#13B4CE] focus:outline-none focus:ring-2 focus:ring-[#13B4CE]/30">
                Mi Perfil
              </Link>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50 hover:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              >
                Cerrar Sesión
              </motion.button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-10"
          >
            <h1 className="text-4xl font-bold tracking-tight">Bienvenido, {user?.nombreCompleto.split(" ")[0]}</h1>
            <p className="mt-3 text-base text-[#5D7E88]">Selecciona un módulo para continuar con la gestión y evaluación.</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group cursor-pointer rounded-3xl border border-[#C3E0E6] bg-white p-8 shadow-xl shadow-slate-200/60 transition-colors hover:border-[#13B4CE]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C3E0E6]/60 ring-1 ring-inset ring-[#13B4CE]/40 transition-colors group-hover:bg-[#13B4CE]/10 text-[#13B4CE]">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#194B64]">Evaluación Asíncrona</h3>
              <p className="mt-3 leading-7 text-sm text-[#5D7E88]">Continuar con la certificación activa usando guardado en segundo plano.</p>
            </motion.div>

            {user?.rol === "Administrador" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                onClick={() => router.push("/dashboard/usuarios")}
                whileHover={{ scale: 1.02, y: -2 }}
                className="group cursor-pointer rounded-3xl border border-[#C3E0E6] bg-white p-8 shadow-xl shadow-slate-200/60 transition-colors hover:border-[#194B64]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C3E0E6]/60 ring-1 ring-inset ring-[#194B64]/40 transition-colors group-hover:bg-[#194B64]/10 text-[#194B64]">
                  <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#194B64]">
                  {loadingUsers ? "Cargando directorio..." : "Gestión de Usuarios"}
                </h3>
                <p className="mt-3 leading-7 text-sm text-[#5D7E88]">Aprovisionar nuevas cuentas y auditar registros de empleados.</p>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {errorUsuarios && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700 shadow-sm"
              >
                {errorUsuarios}
              </motion.div>
            )}

            {verUsuarios && user?.rol === "Administrador" && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-[#C3E0E6] bg-white p-8 shadow-xl shadow-slate-200/60"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-[#194B64]">Directorio Corporativo de Usuarios</h2>
                    <p className="text-sm text-[#5D7E88] mt-2">Lista en tiempo real sincronizada mediante JWT seguro.</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setVerUsuarios(false)}
                    className="text-sm font-semibold text-[#5D7E88] hover:text-[#194B64] border border-[#C3E0E6] rounded-xl px-4 py-2 bg-[#F3F7F9] transition-colors"
                  >
                    Ocultar Lista
                  </motion.button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#C3E0E6] text-xs font-bold uppercase tracking-wider text-[#8EACB4]">
                        <th className="pb-4 pl-2">ID</th>
                        <th className="pb-4">Nombre Completo</th>
                        <th className="pb-4">Correo Corporativo</th>
                        <th className="pb-4">Rol</th>
                        <th className="pb-4">Departamento</th>
                        <th className="pb-4 text-center">Estatus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {usuarios.map((u) => (
                        <tr key={u.idUsuario} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="py-4 pl-2 font-mono text-xs text-[#8EACB4] transition-colors group-hover:text-[#194B64]">{u.idUsuario}</td>
                          <td className="py-4 font-semibold text-[#194B64]">{u.nombreCompleto}</td>
                          <td className="py-4 text-[#5D7E88]">{u.emailCorporativo}</td>
                          <td className="py-4">
                            <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                              u.rol === "Administrador" 
                                ? "bg-purple-50 text-purple-700 ring-purple-700/20" 
                                : u.rol === "Auditor"
                                ? "bg-amber-50 text-amber-700 ring-amber-700/20"
                                : "bg-blue-50 text-blue-700 ring-blue-700/20"
                            }`}>
                              {u.rol}
                            </span>
                          </td>
                          <td className="py-4 text-[#5D7E88]">{u.departamento || "N/A"}</td>
                          <td className="py-4 text-center">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                              u.estatus ? "bg-green-100 text-green-800" : "bg-rose-100 text-rose-800"
                            }`}>
                              {u.estatus ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}