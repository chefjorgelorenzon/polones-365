"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  ChevronDown,
  CircleUserRound,
  ShieldCheck,
  Target,
} from "lucide-react";
import { useState } from "react";

import AvatarUpload from "./AvatarUpload";
import ChangePasswordForm from "./ChangePasswordForm";
import ProfileForm from "./ProfileForm";

type ProfileData = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  avatar_url: string | null;
  study_goal: string;
  current_level: string;
  daily_goal_minutes: number;
  current_lesson_number: number;
};

type ProfileSectionsProps = {
  profile: ProfileData;
};

type SectionId =
  | "personal-data"
  | "avatar"
  | "preferences"
  | "security";

export default function ProfileSections({
  profile,
}: ProfileSectionsProps) {
  const [openSection, setOpenSection] =
    useState<SectionId>("personal-data");

  function toggleSection(section: SectionId) {
    setOpenSection((current) =>
      current === section ? section : section,
    );
  }

  return (
    <div className="space-y-4">
      <AccordionSection
        id="personal-data"
        title="Dados pessoais"
        description="Atualize seu nome, telefone e informações da sua conta."
        icon={CircleUserRound}
        isOpen={openSection === "personal-data"}
        onToggle={() => toggleSection("personal-data")}
      >
        <ProfileForm
          profile={{
            full_name: profile.full_name,
            phone: profile.phone,
            role: profile.role,
            study_goal: profile.study_goal,
            current_level: profile.current_level,
            daily_goal_minutes: profile.daily_goal_minutes,
            current_lesson_number:
              profile.current_lesson_number,
          }}
        />
      </AccordionSection>

      <AccordionSection
        id="avatar"
        title="Foto de perfil"
        description="Escolha a imagem que será exibida na sua conta."
        icon={Camera}
        isOpen={openSection === "avatar"}
        onToggle={() => toggleSection("avatar")}
      >
        <AvatarUpload
          userId={profile.id}
          fullName={profile.full_name}
          initialAvatarUrl={profile.avatar_url}
        />
      </AccordionSection>

      <AccordionSection
        id="preferences"
        title="Preferências de estudo"
        description="Acompanhe e personalize sua rotina de aprendizado."
        icon={Target}
        isOpen={openSection === "preferences"}
        onToggle={() => toggleSection("preferences")}
      >
        <StudyPreferences profile={profile} />
      </AccordionSection>

      <AccordionSection
        id="security"
        title="Segurança"
        description="Altere sua senha e proteja o acesso à sua conta."
        icon={ShieldCheck}
        isOpen={openSection === "security"}
        onToggle={() => toggleSection("security")}
      >
        <ChangePasswordForm />
      </AccordionSection>
    </div>
  );
}

type AccordionSectionProps = {
  id: SectionId;
  title: string;
  description: string;
  icon: React.ElementType;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function AccordionSection({
  id,
  title,
  description,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}: AccordionSectionProps) {
  const contentId = `${id}-content`;

  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-zinc-50 sm:p-6"
      >
        <div className="flex min-w-0 items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${
              isOpen
                ? "bg-red-700 text-white"
                : "bg-red-50 text-red-700"
            }`}
          >
            <Icon size={23} />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-black text-zinc-950 sm:text-lg">
              {title}
            </h2>

            <p className="mt-1 text-sm leading-5 text-zinc-500">
              {description}
            </p>
          </div>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition ${
            isOpen ? "bg-zinc-100 text-zinc-900" : ""
          }`}
        >
          <ChevronDown
            size={21}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              height: {
                duration: 0.3,
              },
              opacity: {
                duration: 0.2,
              },
            }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-100 bg-zinc-50/40 p-4 sm:p-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function StudyPreferences({
  profile,
}: {
  profile: ProfileData;
}) {
  const studyGoalLabels: Record<string, string> = {
    cidadania: "Cidadania polonesa",
    viagem: "Viajar para a Polônia",
    morar_polonia: "Morar na Polônia",
    trabalho: "Trabalho e carreira",
    familia: "Comunicação com familiares",
    hobby: "Hobby e interesse pessoal",
    outro: "Outro objetivo",
  };

  const levelLabels: Record<string, string> = {
    iniciante: "Iniciante",
    basico: "Básico",
    intermediario: "Intermediário",
    avancado: "Avançado",
  };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <PreferenceCard
        label="Objetivo principal"
        value={
          studyGoalLabels[profile.study_goal] ??
          "Ainda não definido"
        }
      />

      <PreferenceCard
        label="Nível atual"
        value={
          levelLabels[profile.current_level] ??
          "Ainda não definido"
        }
      />

      <PreferenceCard
        label="Meta diária"
        value={`${profile.daily_goal_minutes} minutos`}
      />
    </div>
  );
}

function PreferenceCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <p className="text-xs font-black uppercase tracking-[0.15em] text-zinc-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-black text-zinc-900">
        {value}
      </p>
    </div>
  );
}