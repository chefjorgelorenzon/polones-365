import Link from "next/link";
import { ChevronRight, LogIn } from "lucide-react";

import Logo from "@/components/ui/Logo";

export default function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="#como-funciona"
            className="text-sm font-bold text-zinc-600 transition hover:text-red-700"
          >
            Como funciona
          </Link>

          <Link
            href="#beneficios"
            className="text-sm font-bold text-zinc-600 transition hover:text-red-700"
          >
            Benefícios
          </Link>

          <Link
            href="#professor"
            className="text-sm font-bold text-zinc-600 transition hover:text-red-700"
          >
            Professor
          </Link>

          <Link
            href="/planos"
            className="text-sm font-bold text-zinc-600 transition hover:text-red-700"
          >
            Planos
          </Link>

          {/* Login */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100 hover:text-red-700"
          >
            <LogIn size={17} />
            Entrar
          </Link>
        </nav>

        <Link
          href="/cadastro"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#D71920] px-5 text-sm font-black text-white shadow-lg shadow-red-700/20 transition hover:-translate-y-0.5 hover:bg-[#B91319]"
        >
          <span className="hidden sm:inline">
            Começar agora
          </span>

          <span className="sm:hidden">
            Começar
          </span>

          <ChevronRight size={17} />
        </Link>
      </div>
    </header>
  );
}