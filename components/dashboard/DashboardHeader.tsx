"use client";

import Link from "next/link";
import { Bell, Menu, Search, X } from "lucide-react";
import { useState } from "react";

type DashboardHeaderProps = {
  studentName: string;
  studentInitial: string;
};

export default function DashboardHeader({
  studentName,
  studentInitial,
}: DashboardHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur-xl lg:ml-72">
        <div className="flex h-20 items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setMenuOpen((current) => !current)
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100 lg:hidden"
              aria-label={
                menuOpen ? "Fechar menu" : "Abrir menu"
              }
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>

            <div className="hidden items-center gap-3 rounded-2xl bg-zinc-100 px-4 py-3 md:flex md:w-80">
              <Search
                size={18}
                className="shrink-0 text-zinc-400"
              />

              <input
                type="search"
                placeholder="Buscar aulas..."
                aria-label="Buscar aulas"
                className="w-full bg-transparent text-sm font-medium text-zinc-900 outline-none placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100"
              aria-label="Notificações"
            >
              <Bell size={20} />

              <span
                className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-600"
                aria-hidden="true"
              />
            </button>

            <Link
              href="/dashboard/perfil"
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-1.5 pr-3 transition hover:bg-zinc-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-sm font-black uppercase text-red-700">
                {studentInitial}
              </div>

              <div className="hidden sm:block">
                <p className="max-w-40 truncate text-sm font-black leading-none text-zinc-900">
                  {studentName}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Aluno
                </p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm"
            onClick={closeMenu}
          />

          <aside className="relative h-full w-[86%] max-w-sm overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-700 font-black text-white">
                  MP
                </div>

                <div>
                  <p className="font-black text-zinc-950">
                    Márcio Polonês
                  </p>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
                    Polonês 3.0
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                aria-label="Fechar menu"
              >
                <X size={21} />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-zinc-50 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 font-black uppercase text-red-700">
                {studentInitial}
              </div>

              <div className="min-w-0">
                <p className="truncate font-black text-zinc-950">
                  {studentName}
                </p>

                <p className="mt-1 text-xs font-medium text-zinc-500">
                  Aluno
                </p>
              </div>
            </div>

            <nav className="mt-6 space-y-2">
              <MobileLink
                href="/dashboard"
                label="Início"
                onClick={closeMenu}
              />

              <MobileLink
                href="/dashboard/aula-do-dia"
                label="Aula de hoje"
                onClick={closeMenu}
              />

              <MobileLink
                href="/dashboard/aulas"
                label="Biblioteca"
                onClick={closeMenu}
              />

              <MobileLink
                href="/dashboard/progresso"
                label="Meu progresso"
                onClick={closeMenu}
              />

              <MobileLink
                href="/dashboard/conquistas"
                label="Conquistas"
                onClick={closeMenu}
              />

              <MobileLink
                href="/dashboard/perfil"
                label="Meu perfil"
                onClick={closeMenu}
              />
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}

type MobileLinkProps = {
  href: string;
  label: string;
  onClick: () => void;
};

function MobileLink({
  href,
  label,
  onClick,
}: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-4 py-3.5 font-bold text-zinc-700 transition hover:bg-red-50 hover:text-red-700"
    >
      {label}
    </Link>
  );
}