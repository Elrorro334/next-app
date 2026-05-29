"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useMotionTemplate, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface PerfilData {
  nombreCompleto: string;
  emailCorporativo: string;
  rol: string;
  departamento: string;
  estatus: boolean;
  fechaRegistro: string;
}

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para la edición
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ nombreCompleto: "", departamento: "" });
  const [updateMsg, setUpdateMsg] = useState<{ type: "success" | "error", text: string } | null>(null);

  const router = useRouter();

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
    if (!token) {
      router.push("/login");
      return;
    }
    fetchPerfil(token);
  }, [router]);

  const fetchPerfil = async (token: string) => {
    try {
      const response = await fetch("https://localhost:7173/api/Auth/perfil", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("No se pudo cargar la información del perfil.");
      
      const data = await response.json();
      setPerfil(data);
      // Inicializar el formulario con los datos actuales
      setFormData({ nombreCompleto: data.nombreCompleto, departamento: data.departamento || "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión al obtener el perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setUpdateMsg(null);
    
    const token = sessionStorage.getItem("evaluma_session_token");

    try {
      const response = await fetch("https://localhost:7173/api/Auth/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nombreCompleto: formData.nombreCompleto.trim(),
          departamento: formData.departamento.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Error al actualizar el perfil.");
      }

      // Actualizar el estado local para reflejar los cambios inmediatamente
      setPerfil(prev => prev ? { ...prev, nombreCompleto: formData.nombreCompleto.trim(), departamento: formData.departamento.trim() } : null);
      
      // Actualizar también el sessionStorage para que el Header (Layout) se actualice si recargan
      const sessionUser = sessionStorage.getItem("evaluma_user");
      if (sessionUser) {
        const parsedUser = JSON.parse(sessionUser);
        parsedUser.nombreCompleto = formData.nombreCompleto.trim();
        parsedUser.departamento = formData.departamento.trim();
        sessionStorage.setItem("evaluma_user", JSON.stringify(parsedUser));
      }

      setUpdateMsg({ type: "success", text: "Perfil actualizado correctamente." });
      setIsEditing(false);
    } catch (err) {
      setUpdateMsg({ type: "error", text: err instanceof Error ? err.message : "Error inesperado al guardar." });
    } finally {
      setIsSaving(false);
      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => setUpdateMsg(null), 3000);
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
                <p className="text-sm font-semibold">Portal Corporativo</p>
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{perfil?.nombreCompleto}</p>
              <p className="text-xs font-medium text-[#5D7E88]">{perfil?.rol} • {perfil?.departamento}</p>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 p-6 py-10">
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
            <span className="text-[#194B64]">Mi Perfil</span>
          </motion.nav>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
                {error}
              </motion.div>
            )}
            
            {updateMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`mb-6 rounded-2xl border p-4 text-sm font-medium shadow-sm ${
                updateMsg.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-rose-200 bg-rose-50 text-rose-700'
              }`}>
                {updateMsg.text}
              </motion.div>
            )}
          </AnimatePresence>

          {perfil && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-3xl border border-[#C3E0E6] bg-white shadow-xl shadow-slate-200/60"
            >
              <div className="relative h-32 bg-gradient-to-r from-[#194B64] to-[#13B4CE]">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
              </div>
              
              <form onSubmit={handleUpdate} className="px-8 pb-10">
                <div className="relative -mt-16 mb-8 flex justify-between items-end">
                  <div className="flex h-32 w-32 items-center justify-center rounded-3xl border-4 border-white bg-[#F3F7F9] shadow-lg">
                    <span className="text-4xl font-bold text-[#194B64]">
                      {perfil.nombreCompleto.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="mb-4 flex flex-col items-end gap-3 sm:flex-row sm:items-center">
                    <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold shadow-sm ${
                      perfil.estatus ? "bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20" : "bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-600/20"
                    }`}>
                      <span className={`mr-2 h-2 w-2 rounded-full ${perfil.estatus ? "bg-green-500" : "bg-rose-500"}`}></span>
                      {perfil.estatus ? "Cuenta Activa" : "Cuenta Inactiva"}
                    </span>
                    
                    {!isEditing ? (
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#F3F7F9] px-4 py-2 text-sm font-semibold text-[#194B64] ring-1 ring-inset ring-[#C3E0E6] transition-colors hover:bg-[#C3E0E6]/30"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                          <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Editar Perfil
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({ nombreCompleto: perfil.nombreCompleto, departamento: perfil.departamento || "" }); // Restaurar valores originales
                          }}
                          disabled={isSaving}
                          className="rounded-xl px-4 py-2 text-sm font-semibold text-[#5D7E88] transition-colors hover:bg-slate-100 disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit"
                          disabled={isSaving}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#13B4CE] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#13B4CE]/20 transition-colors hover:bg-[#0ea3bb] disabled:opacity-60"
                        >
                          {isSaving ? "Guardando..." : "Guardar Cambios"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  {isEditing ? (
                    <div className="max-w-md">
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8EACB4]">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        value={formData.nombreCompleto}
                        onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                        className="w-full rounded-xl border border-[#C3E0E6] bg-[#F3F7F9] px-4 py-2.5 text-base font-semibold text-[#194B64] outline-none transition-all focus:border-[#13B4CE] focus:bg-white focus:ring-4 focus:ring-[#13B4CE]/10"
                      />
                    </div>
                  ) : (
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#194B64]">{perfil.nombreCompleto}</h1>
                  )}
                  <p className="mt-2 text-base font-medium text-[#5D7E88]">{perfil.emailCorporativo}</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#C3E0E6]/60 bg-[#F3F7F9]/50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#8EACB4]">Rol del Sistema</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#13B4CE]/10 text-[#13B4CE]">
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-[#194B64]">{perfil.rol}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#C3E0E6]/60 bg-[#F3F7F9]/50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#8EACB4]">Departamento</p>
                    {isEditing ? (
                      <input
                        type="text"
                        required
                        value={formData.departamento}
                        onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                        className="mt-2 w-full rounded-xl border border-[#C3E0E6] bg-white px-4 py-2 text-base font-semibold text-[#194B64] outline-none transition-all focus:border-[#13B4CE] focus:ring-4 focus:ring-[#13B4CE]/10"
                      />
                    ) : (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#194B64]/10 text-[#194B64]">
                          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <p className="text-lg font-semibold text-[#194B64]">{perfil.departamento || "N/A"}</p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-[#C3E0E6]/60 bg-[#F3F7F9]/50 p-5 sm:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#8EACB4]">Fecha de Registro</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8EACB4]/10 text-[#5D7E88]">
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-[#194B64]">
                        {new Date(perfil.fechaRegistro).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </motion.section>
          )}
        </main>
      </div>
    </div>
  );
}