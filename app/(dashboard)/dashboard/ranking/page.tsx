
import { redirect } from "next/navigation";
import {
  ArrowUp,
  Crown,
  Flame,
  Medal,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type GamificationRow = {
  user_id: string;
  xp: number;
  level: number;
  streak_days: number;
  lessons_completed: number;
  updated_at: string | null;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

type RankingUser = GamificationRow & {
  full_name: string;
  avatar_url: string | null;
  position: number;
};

export default async function RankingPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  /*
   * Buscamos os 100 alunos com mais XP.
   * Para o MVP, 100 posições são suficientes e evitam
   * carregar todos os usuários da plataforma.
   */
  const { data: gamificationData, error: rankingError } =
    await supabase
      .from("gamification")
      .select(
        `
          user_id,
          xp,
          level,
          streak_days,
          lessons_completed,
          updated_at
        `,
      )
      .order("xp", {
        ascending: false,
      })
      .order("updated_at", {
        ascending: true,
        nullsFirst: false,
      })
      .limit(100);

  if (rankingError) {
    console.error("Erro ao carregar ranking:", rankingError);
  }

  const gamificationRows =
    (gamificationData as GamificationRow[] | null) ?? [];

  /*
   * Buscamos os perfis separadamente porque a tabela
   * gamification pode estar ligada diretamente ao auth.users,
   * sem relacionamento automático com profiles.
   */
  const userIds = gamificationRows.map((item) => item.user_id);

  const profilesMap = new Map<string, ProfileRow>();

  if (userIds.length > 0) {
    const { data: profilesData, error: profilesError } =
      await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

    if (profilesError) {
      console.error(
        "Erro ao carregar perfis do ranking:",
        profilesError,
      );
    }

    for (const profile of (profilesData as ProfileRow[] | null) ??
      []) {
      profilesMap.set(profile.id, profile);
    }
  }

  const ranking: RankingUser[] = gamificationRows.map(
    (item, index) => {
      const profile = profilesMap.get(item.user_id);

      return {
        ...item,
        full_name:
          profile?.full_name?.trim() ||
          getAnonymousName(item.user_id),
        avatar_url: profile?.avatar_url ?? null,
        position: index + 1,
      };
    },
  );

  /*
   * Pontuação atual do aluno.
   */
  const { data: currentGamificationData } = await supabase
    .from("gamification")
    .select(
      `
        user_id,
        xp,
        level,
        streak_days,
        lessons_completed,
        updated_at
      `,
    )
    .eq("user_id", user.id)
    .maybeSingle();

  const currentGamification =
    currentGamificationData as GamificationRow | null;

  const currentXp = currentGamification?.xp ?? 0;

  /*
   * Posição global:
   * quantidade de usuários com XP maior + 1.
   */
  const { count: usersAheadCount } = await supabase
    .from("gamification")
    .select("user_id", {
      count: "exact",
      head: true,
    })
    .gt("xp", currentXp);

  const currentPosition = (usersAheadCount ?? 0) + 1;

  /*
   * Total de alunos participantes.
   */
  const { count: totalParticipantsCount } = await supabase
    .from("gamification")
    .select("user_id", {
      count: "exact",
      head: true,
    });

  const totalParticipants = totalParticipantsCount ?? 0;

  /*
   * Busca o aluno imediatamente acima em pontuação.
   */
  const { data: nextPositionData } = await supabase
    .from("gamification")
    .select("xp")
    .gt("xp", currentXp)
    .order("xp", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  const nextPositionXp =
    typeof nextPositionData?.xp === "number"
      ? nextPositionData.xp
      : null;

  const xpToNextPosition =
    nextPositionXp !== null
      ? Math.max(nextPositionXp - currentXp + 1, 1)
      : 0;

  const currentProfile =
    profilesMap.get(user.id) ??
    (await getCurrentProfile(user.id, supabase));

  const currentUser: RankingUser = {
    user_id: user.id,
    xp: currentXp,
    level: currentGamification?.level ?? 1,
    streak_days: currentGamification?.streak_days ?? 0,
    lessons_completed:
      currentGamification?.lessons_completed ?? 0,
    updated_at: currentGamification?.updated_at ?? null,
    full_name:
      currentProfile?.full_name?.trim() ||
      user.email?.split("@")[0] ||
      "Aluno",
    avatar_url: currentProfile?.avatar_url ?? null,
    position: currentPosition,
  };

  const podium = ranking.slice(0, 3);
  const rankingList = ranking.slice(3, 50);

  return (
    <main className="mx-auto w-full max-w-6xl">
      <RankingHeader />

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <StatsCard
          icon={Trophy}
          label="Sua posição"
          value={`#${currentPosition}`}
          description={`Entre ${formatNumber(
            totalParticipants,
          )} alunos`}
        />

        <StatsCard
          icon={Star}
          label="Seu XP"
          value={formatNumber(currentXp)}
          description={getLevelName(currentXp)}
        />

        <StatsCard
          icon={ArrowUp}
          label="Próxima posição"
          value={
            xpToNextPosition > 0
              ? `${formatNumber(xpToNextPosition)} XP`
              : "Você lidera"
          }
          description={
            xpToNextPosition > 0
              ? "Para ultrapassar o próximo aluno"
              : "Continue mantendo o primeiro lugar"
          }
        />
      </section>

      {ranking.length > 0 ? (
        <>
          <Podium
            users={podium}
            currentUserId={user.id}
          />

          <section className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-zinc-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
                  Classificação geral
                </p>

                <h2 className="mt-2 text-xl font-black text-zinc-950 sm:text-2xl">
                  Ranking dos alunos
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  O ranking é atualizado conforme os alunos
                  acumulam XP.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-700">
                <Users size={18} />

                {formatNumber(totalParticipants)} participantes
              </div>
            </div>

            <div className="divide-y divide-zinc-100">
              {rankingList.map((rankingUser) => (
                <RankingRow
                  key={rankingUser.user_id}
                  user={rankingUser}
                  isCurrentUser={
                    rankingUser.user_id === user.id
                  }
                />
              ))}

              {rankingList.length === 0 && (
                <div className="p-8 text-center text-sm text-zinc-500">
                  Ainda não existem outros alunos suficientes para
                  completar o ranking.
                </div>
              )}
            </div>
          </section>

          {!ranking.some(
            (rankingUser) => rankingUser.user_id === user.id,
          ) && (
            <CurrentUserPosition user={currentUser} />
          )}
        </>
      ) : (
        <EmptyRanking currentUser={currentUser} />
      )}
    </main>
  );
}

function RankingHeader() {
  return (
    <header>
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <Trophy size={29} />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">
            Gamificação
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
            Ranking
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
            Estude todos os dias, conclua aulas e acumule XP para
            subir no ranking da comunidade.
          </p>
        </div>
      </div>
    </header>
  );
}

type StatsCardProps = {
  icon: React.ElementType;
  label: string;
  value: string;
  description: string;
};

function StatsCard({
  icon: Icon,
  label,
  value,
  description,
}: StatsCardProps) {
  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-700">
          <Icon size={21} />
        </div>

        <Sparkles size={18} className="text-amber-500" />
      </div>

      <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black tracking-tight text-zinc-950">
        {value}
      </p>

      <p className="mt-2 text-sm leading-5 text-zinc-500">
        {description}
      </p>
    </article>
  );
}

function Podium({
  users,
  currentUserId,
}: {
  users: RankingUser[];
  currentUserId: string;
}) {
  if (users.length === 0) {
    return null;
  }

  const first = users[0];
  const second = users[1];
  const third = users[2];

  return (
    <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="text-center">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
          Pódio
        </p>

        <h2 className="mt-2 text-2xl font-black text-zinc-950">
          Destaques da comunidade
        </h2>
      </div>

      <div className="mt-8 grid items-end gap-4 sm:grid-cols-3">
        <div className="order-2 sm:order-1">
          {second && (
            <PodiumCard
              user={second}
              place={2}
              isCurrentUser={second.user_id === currentUserId}
            />
          )}
        </div>

        <div className="order-1 sm:order-2">
          {first && (
            <PodiumCard
              user={first}
              place={1}
              isCurrentUser={first.user_id === currentUserId}
            />
          )}
        </div>

        <div className="order-3">
          {third && (
            <PodiumCard
              user={third}
              place={3}
              isCurrentUser={third.user_id === currentUserId}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function PodiumCard({
  user,
  place,
  isCurrentUser,
}: {
  user: RankingUser;
  place: 1 | 2 | 3;
  isCurrentUser: boolean;
}) {
  const placeStyles = {
    1: {
      wrapper:
        "border-amber-300 bg-gradient-to-b from-amber-50 to-white sm:min-h-[300px]",
      icon: "bg-amber-100 text-amber-700",
      badge: "bg-amber-500 text-white",
      title: "1º lugar",
    },
    2: {
      wrapper:
        "border-zinc-300 bg-gradient-to-b from-zinc-100 to-white sm:min-h-[260px]",
      icon: "bg-zinc-200 text-zinc-700",
      badge: "bg-zinc-500 text-white",
      title: "2º lugar",
    },
    3: {
      wrapper:
        "border-orange-200 bg-gradient-to-b from-orange-50 to-white sm:min-h-[240px]",
      icon: "bg-orange-100 text-orange-700",
      badge: "bg-orange-600 text-white",
      title: "3º lugar",
    },
  };

  const styles = placeStyles[place];

  return (
    <article
      className={`relative flex flex-col items-center justify-center rounded-3xl border p-6 text-center ${styles.wrapper} ${
        isCurrentUser ? "ring-4 ring-red-100" : ""
      }`}
    >
      <div
        className={`absolute left-4 top-4 flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-xs font-black ${styles.badge}`}
      >
        #{place}
      </div>

      <div
        className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl ${styles.icon}`}
      >
        {place === 1 ? (
          <Crown size={19} />
        ) : (
          <Medal size={19} />
        )}
      </div>

      <Avatar
        name={user.full_name}
        avatarUrl={user.avatar_url}
        size="large"
      />

      <p className="mt-4 max-w-full truncate text-lg font-black text-zinc-950">
        {user.full_name}
      </p>

      {isCurrentUser && (
        <span className="mt-2 rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
          Você
        </span>
      )}

      <p className="mt-4 text-2xl font-black text-zinc-950">
        {formatNumber(user.xp)} XP
      </p>

      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-zinc-500">
        <Flame size={16} className="text-orange-500" />
        {user.streak_days} dias de sequência
      </div>

      <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-zinc-400">
        {styles.title}
      </p>
    </article>
  );
}

function RankingRow({
  user,
  isCurrentUser,
}: {
  user: RankingUser;
  isCurrentUser: boolean;
}) {
  return (
    <article
      className={`flex items-center gap-3 px-4 py-4 transition sm:gap-5 sm:px-6 ${
        isCurrentUser
          ? "bg-red-50"
          : "bg-white hover:bg-zinc-50"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
          isCurrentUser
            ? "bg-red-700 text-white"
            : "bg-zinc-100 text-zinc-600"
        }`}
      >
        {user.position}
      </div>

      <Avatar
        name={user.full_name}
        avatarUrl={user.avatar_url}
        size="small"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-black text-zinc-950 sm:text-base">
            {user.full_name}
          </p>

          {isCurrentUser && (
            <span className="shrink-0 rounded-full bg-red-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-red-700">
              Você
            </span>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-zinc-500">
          <span>{getLevelName(user.xp)}</span>

          <span className="flex items-center gap-1">
            <Flame size={13} className="text-orange-500" />
            {user.streak_days} dias
          </span>

          <span>
            {user.lessons_completed} aulas
          </span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-black text-zinc-950 sm:text-base">
          {formatNumber(user.xp)}
        </p>

        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-zinc-400">
          XP
        </p>
      </div>
    </article>
  );
}

function CurrentUserPosition({
  user,
}: {
  user: RankingUser;
}) {
  return (
    <section className="sticky bottom-4 z-10 mt-6 rounded-3xl border border-red-200 bg-white p-4 shadow-xl shadow-red-950/10 sm:p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-700 text-sm font-black text-white">
          {user.position}
        </div>

        <Avatar
          name={user.full_name}
          avatarUrl={user.avatar_url}
          size="small"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-zinc-950">
            Sua posição
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Continue estudando para subir no ranking.
          </p>
        </div>

        <p className="shrink-0 text-sm font-black text-red-700">
          {formatNumber(user.xp)} XP
        </p>
      </div>
    </section>
  );
}

function EmptyRanking({
  currentUser,
}: {
  currentUser: RankingUser;
}) {
  return (
    <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-amber-700">
        <Trophy size={30} />
      </div>

      <h2 className="mt-5 text-2xl font-black text-zinc-950">
        O ranking está começando
      </h2>

      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-zinc-500">
        Conclua aulas e atividades para ganhar seus primeiros
        pontos e aparecer na classificação.
      </p>

      <div className="mx-auto mt-6 max-w-md">
        <RankingRow
          user={currentUser}
          isCurrentUser
        />
      </div>
    </section>
  );
}

function Avatar({
  name,
  avatarUrl,
  size,
}: {
  name: string;
  avatarUrl: string | null;
  size: "small" | "large";
}) {
  const sizeClasses =
    size === "large"
      ? "h-20 w-20 text-xl"
      : "h-11 w-11 text-sm";

  if (avatarUrl) {
    return (
      <div
        className={`overflow-hidden rounded-full border-2 border-white bg-zinc-100 shadow-sm ${sizeClasses}`}
      >
        <img
  src={avatarUrl}
  alt={`Foto de ${name}`}
  className="h-full w-full object-cover"
  loading="lazy"
  referrerPolicy="no-referrer"
/>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-red-100 font-black text-red-700 ${sizeClasses}`}
    >
      {getInitials(name)}
    </div>
  );
}

async function getCurrentProfile(
  userId: string,
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  return data as ProfileRow | null;
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "A";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getAnonymousName(userId: string) {
  return `Aluno ${userId.slice(0, 4).toUpperCase()}`;
}

function getLevelName(xp: number) {
  if (xp >= 7000) {
    return "Fluente";
  }

  if (xp >= 3500) {
    return "Conversador";
  }

  if (xp >= 1500) {
    return "Estudante";
  }

  if (xp >= 500) {
    return "Explorador";
  }

  return "Iniciante";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}