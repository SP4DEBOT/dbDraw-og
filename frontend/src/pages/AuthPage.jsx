import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Database, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";

export function AuthPage({ mode, onSubmit, onNavigate, onBack, isDarkMode, isSubmitting, error }) {
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    await onSubmit({ name, email, password });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#08090c] text-white" : "bg-[#f4f1ea] text-[#11120f]"}`}>
      <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-6 md:px-10">
        <button onClick={onBack} className="group flex items-center gap-3 text-left" type="button">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d7ff3f] text-black transition group-hover:rotate-6">
            <Database size={20} strokeWidth={2.5} />
          </span>
          <span className="font-mono text-sm font-black tracking-[-0.04em]">dbDraw</span>
        </button>
        <button onClick={onBack} type="button" className="flex items-center gap-2 text-xs font-bold text-black/45 hover:text-black dark:text-white/45 dark:hover:text-white">
          <ArrowLeft size={14} /> Back to home
        </button>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-92px)] max-w-[1200px] items-center gap-14 px-6 pb-16 md:grid-cols-[0.9fr_1.1fr] md:px-10">
        <section className="hidden md:block">
          <p className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-black/40 dark:text-white/35">Visual database architecture</p>
          <h1 className="max-w-xl text-6xl font-black leading-[0.92] tracking-[-0.065em]">
            {isRegister ? "Build a workspace that remembers your system." : "Welcome back to the canvas."}
          </h1>
          <p className="mt-7 max-w-lg text-sm leading-6 text-black/55 dark:text-white/45">
            Your schemas live in MongoDB, your session is secured with JWT, and the canvas stays focused on the work.
          </p>
          <div className="mt-10 flex gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-black/35 dark:text-white/30">
            <span>React Flow</span><span>·</span><span>MongoDB</span><span>·</span><span>AI</span>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 dark:text-white/35">{isRegister ? "Create account" : "Sign in"}</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em]">{isRegister ? "Start designing." : "Continue designing."}</h2>
            <p className="mt-2 text-sm text-black/50 dark:text-white/40">
              {isRegister ? "Create your dbDraw workspace in a few seconds." : "Use your dbDraw account to open saved schemas."}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {isRegister && (
              <label className="block">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-black/45 dark:text-white/40">Name</span>
                <div className="relative">
                  <UserRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30" />
                  <input required value={name} onChange={(e) => setName(e.target.value)} className="auth-input" placeholder="Your name" autoComplete="name" />
                </div>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-black/45 dark:text-white/40">Email</span>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" placeholder="you@example.com" autoComplete="email" />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-black/45 dark:text-white/40">Password</span>
              <div className="relative">
                <LockKeyhole size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30" />
                <input required minLength={8} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input pr-12" placeholder="At least 8 characters" autoComplete={isRegister ? "new-password" : "current-password"} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-black/35 hover:text-black dark:text-white/35 dark:hover:text-white" aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            {error && <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs font-medium text-red-600 dark:text-red-300">{error}</div>}

            <button disabled={isSubmitting} type="submit" className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#d7ff3f] px-5 py-3.5 text-sm font-black text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
              {!isSubmitting && <ArrowRight size={15} className="transition group-hover:translate-x-1" />}
            </button>
          </form>

          <div className="mt-7 border-t border-black/10 pt-6 text-center dark:border-white/10">
            <span className="text-xs text-black/45 dark:text-white/40">{isRegister ? "Already have an account?" : "New to dbDraw?"}</span>{" "}
            <button type="button" onClick={() => onNavigate(isRegister ? "login" : "register")} className="text-xs font-black underline decoration-black/20 underline-offset-4 hover:decoration-current dark:decoration-white/20">
              {isRegister ? "Sign in" : "Create an account"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
