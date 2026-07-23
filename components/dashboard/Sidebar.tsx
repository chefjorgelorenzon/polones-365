"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChartNoAxesColumnIncreasing,
  CircleUserRound,
  House,
  LoaderCircle,
  LogOut,
  Medal,
  PlayCircle,
  Settings,
  Trophy,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const menuItems = [
  {
    label: "Início",
    href: "/dashboard",
    icon: House,
  },
  {
    label: "Aula de hoje",
    href: "/dashboard/aula-do-dia",
    icon: PlayCircle,
  },
  {
    label: "Biblioteca",
    href: "/dashboard/aulas",
    icon: BookOpen,
  },
  {
    label: "Meu progresso",
    href: "/dashboard/progresso",
    icon: ChartNoAxesColumnIncreasing,
  },
   {
    label: "Ranking",
    href: "/dashboard/ranking",
    icon: Trophy,
  },
  {
    label: "Conquistas",
    href: "/dashboard/conquistas",
    icon: Medal,
  },
];

const accountItems = [
  {
    label: "Meu perfil",
    href: "/dashboard/perfil",
    icon: CircleUserRound,
  },
  {
    label: "Configurações",
    href: "/dashboard/configuracoes",
    icon: Settings,
  },
];

type Profile = {
  full_name: string | null;
  avatar_url: string | null;
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const supabase = useMemo(() => createClient(), []);

  const [profile, setProfile] = useState<Profile>({
    full_name: null,
    avatar_url: null,
  });

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Erro ao carregar usuário:", userError);
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Erro ao carregar perfil:", profileError);
        return;
      }

      setProfile({
        full_name: data.full_name,
        avatar_url: data.avatar_url,
      });
    } finally {
      setIsLoadingProfile(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    function handleProfileUpdated() {
      loadProfile();
    }

    window.addEventListener("profile-updated", handleProfileUpdated);
    window.addEventListener("avatar-updated", handleProfileUpdated);

    return () => {
      window.removeEventListener(
        "profile-updated",
        handleProfileUpdated,
      );

      window.removeEventListener(
        "avatar-updated",
        handleProfileUpdated,
      );
    };
  }, [loadProfile]);

  async function handleSignOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setSignOutError("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erro ao sair da conta:", error);
      setSignOutError("Não foi possível sair. Tente novamente.");
      setIsSigningOut(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  function isActiveLink(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  }

  const studentName =
    profile.full_name?.trim() || "Aluno Polonês";

  const firstName =
    studentName.split(/\s+/)[0] || "Aluno";

  const initials = getInitials(studentName);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-zinc-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-24 items-center border-b border-zinc-100 px-7">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D71920] text-lg font-black text-white shadow-lg shadow-red-700/20">
            MP
          </div>

          <div>
            <p className="text-lg font-black leading-none text-zinc-950">
              Márcio Polonês
            </p>

            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-red-700">
              Polonês 3.0
            </p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-7">
        <p className="px-3 text-xs font-black uppercase tracking-[0.22em] text-zinc-400">
          Aprendizado
        </p>

        <nav className="mt-3 space-y-1">
          {menuItems.map(({ label, href, icon: Icon }) => {
            const active = isActiveLink(href);

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition ${
                  active
                    ? "bg-red-50 text-red-700"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </nav>

        <p className="mt-9 px-3 text-xs font-black uppercase tracking-[0.22em] text-zinc-400">
          Minha conta
        </p>

        <nav className="mt-3 space-y-1">
          {accountItems.map(({ label, href, icon: Icon }) => {
            const active = isActiveLink(href);

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition ${
                  active
                    ? "bg-red-50 text-red-700"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-zinc-100 p-4">
        <div className="rounded-2xl bg-zinc-950 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-red-700 text-sm font-black text-white">
              {isLoadingProfile ? (
                <LoaderCircle
                  size={20}
                  className="animate-spin"
                />
              ) : profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={`Foto de perfil de ${studentName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black">
                {isLoadingProfile ? "Carregando..." : firstName}
              </p>

              <p className="truncate text-xs text-zinc-400">
                Plano anual
              </p>
            </div>

            <Link
              href="/dashboard/perfil"
              aria-label="Abrir meu perfil"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <Settings size={17} />
            </Link>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningOut ? (
              <>
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
                Saindo...
              </>
            ) : (
              <>
                <LogOut size={17} />
                Sair
              </>
            )}
          </button>

          {signOutError && (
            <p className="mt-2 text-center text-xs font-semibold text-red-300">
              {signOutError}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

function getInitials(fullName: string) {
  const names = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (names.length === 0) {
    return "AL";
  }

  if (names.length === 1) {
    return names[0].slice(0, 2).toUpperCase();
  }

  return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
}