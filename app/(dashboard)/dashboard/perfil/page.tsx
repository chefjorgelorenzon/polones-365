import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/services/profile.service";
import ProfileForm from "./ProfileForm";
import AvatarUpload from "./AvatarUpload";

export default async function PerfilPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <main className="space-y-8">
  <div>
    <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
      Minha conta
    </p>

    <h1 className="mt-2 text-3xl font-black text-zinc-950 sm:text-4xl">
      Meu perfil
    </h1>

    <p className="mt-3 max-w-2xl text-zinc-600">
      Atualize suas informações pessoais e defina suas preferências
      de aprendizado.
    </p>
  </div>

  <AvatarUpload
    userId={profile.id}
    fullName={profile.full_name}
    initialAvatarUrl={profile.avatar_url}
  />

  <ProfileForm
    profile={{
      full_name: profile.full_name,
      phone: profile.phone,
      role: profile.role,
      study_goal: profile.study_goal,
      current_level: profile.current_level,
      daily_goal_minutes: profile.daily_goal_minutes,
      current_lesson_number: profile.current_lesson_number,
    }}
  />
</main>
  );
}