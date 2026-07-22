"use client";

import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";

import type { StudentCourse } from "@/types/student-course";
import ModuleCard from "./ModuleCard";

type Props = {
  initialCourse: StudentCourse;
};

export default function LessonsLibrary({
  initialCourse,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredModules = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return initialCourse.modules;
    }

    return initialCourse.modules
      .map((module) => ({
        ...module,
        lessons: module.lessons.filter((lesson) => {
          const lessonNumber =
            lesson.lesson_number.toString();

          const title =
            lesson.title.toLowerCase();

          const description =
            lesson.short_description?.toLowerCase() ?? "";

          return (
            title.includes(term) ||
            lessonNumber.includes(term) ||
            description.includes(term)
          );
        }),
      }))
      .filter((module) => module.lessons.length > 0);
  }, [search, initialCourse.modules]);

  const hasSearchResults = filteredModules.length > 0;

  return (
    <div className="pb-10">
      {/* Cabeçalho */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
            Polonês 3.0
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Biblioteca de aulas
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-600">
            Explore todos os módulos do curso e acompanhe sua evolução.
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-700">
              <BookOpen />
            </div>

            <div>
              <p className="text-3xl font-black">
                {initialCourse.completedLessons}/
                {initialCourse.totalLessons}
              </p>

              <p className="text-sm text-zinc-500">
                aulas concluídas
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-red-700 transition-all duration-500"
              style={{
                width: `${initialCourse.progressPercentage}%`,
              }}
            />
          </div>

          <p className="mt-2 text-right text-xs font-bold text-zinc-500">
            {initialCourse.progressPercentage}% concluído
          </p>
        </div>
      </div>

      {/* Busca */}

      <div className="mt-8 rounded-3xl border bg-white p-6">
        <div className="flex items-center gap-3 rounded-2xl border bg-zinc-50 px-4 py-3 focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-100">
          <Search
            size={20}
            className="shrink-0 text-zinc-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Buscar por título, número ou descrição..."
            aria-label="Buscar aula"
            className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* Módulos */}

      <div className="mt-6 space-y-5">
        {hasSearchResults ? (
          filteredModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
            />
          ))
        ) : (
          <div className="rounded-3xl border border-dashed bg-white px-6 py-12 text-center">
            <Search
              size={32}
              className="mx-auto text-zinc-300"
            />

            <h2 className="mt-4 text-lg font-black text-zinc-800">
              Nenhuma aula encontrada
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Tente buscar usando outro título, número ou palavra.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}