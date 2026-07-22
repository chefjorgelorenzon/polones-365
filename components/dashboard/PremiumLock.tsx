import Link from "next/link";
import { Lock } from "lucide-react";

type PremiumLockProps = {
  locked: boolean;
  children: React.ReactNode;
};

export default function PremiumLock({
  locked,
  children,
}: PremiumLockProps) {
  if (!locked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="pointer-events-none select-none opacity-50 blur-[2px]">
        {children}
      </div>

      <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/60 backdrop-blur-[2px]">
        <div className="mx-4 max-w-xs rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-700">
            <Lock size={24} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-zinc-900">
            Conteúdo Premium
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Ative sua assinatura para liberar este recurso e continuar sua jornada no polonês.
          </p>

          <Link
            href="/planos"
            className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-red-700 px-5 font-semibold text-white transition hover:bg-red-600"
          >
            Ativar assinatura
          </Link>
        </div>
      </div>
    </div>
  );
}