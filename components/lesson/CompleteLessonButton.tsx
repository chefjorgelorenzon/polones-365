"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import { markLessonCompleted } from "@/lib/services/progress.service";

type Props = {
  lessonId: string;
  initialCompleted: boolean;
};

export default function CompleteLessonButton({
  lessonId,
  initialCompleted,
}: Props) {
  const router = useRouter();

  const [completed, setCompleted] =
    useState(initialCompleted);

  const [isSaving, setIsSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState<
    string | null
  >(null);

  async function handleComplete() {
    if (completed || isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);

      await markLessonCompleted(lessonId);

      setCompleted(true);

      router.refresh();
    } catch (error) {
      console.error(
        "Erro ao concluir aula:",
        error
      );

      setErrorMessage(
        "Não foi possível marcar a aula como concluída."
      );
    } finally {
      setIsSaving(false);
    }
  }

  const isDisabled = isSaving || completed;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleComplete}
        disabled={isDisabled}
        className={`inline-flex min-w-[210px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition ${
          completed
            ? "bg-green-700"
            : "bg-red-700 hover:bg-red-800"
        } disabled:cursor-not-allowed disabled:opacity-70`}
      >
        {isSaving ? (
          <LoaderCircle
            size={18}
            className="animate-spin"
          />
        ) : (
          <CheckCircle2 size={18} />
        )}

        {isSaving
          ? "Salvando..."
          : completed
            ? "Aula concluída"
            : "Marcar como concluída"}
      </button>

      {errorMessage && (
        <p className="max-w-[260px] text-center text-xs font-medium text-red-700">
          {errorMessage}
        </p>
      )}
    </div>
  );
}