"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trophy,
} from "lucide-react";
import {
  getLessonQuiz,
  getLessonQuizResult,
  submitLessonQuiz,
} from "@/lib/services/quiz.service";
import type {
  QuizAnswer,
  QuizAttemptResult,
  QuizQuestion,
} from "@/types/quiz";

type LessonQuizProps = {
  lessonId: string;
  onCompleted?: () => void;
};

export default function LessonQuiz({
  lessonId,
  onCompleted,
}: LessonQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  async function loadQuiz() {
    try {
      setLoading(true);
      setError(null);

      const [quizQuestions, previousResult] = await Promise.all([
        getLessonQuiz(lessonId),
        getLessonQuizResult(lessonId),
      ]);

      setQuestions(quizQuestions);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setResult(previousResult);

      if (previousResult) {
        onCompleted?.();
      }
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar o quiz desta aula.");
    } finally {
      setLoading(false);
    }
  }

  void loadQuiz();
}, [lessonId, onCompleted]);
  const currentQuestion = questions[currentQuestionIndex];

  const selectedOptionId = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  const totalQuestions = questions.length;

  const progressPercentage =
    totalQuestions > 0
      ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)
      : 0;

  const answeredQuestionsCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );

  const isLastQuestion =
    currentQuestionIndex === totalQuestions - 1;

  const canGoNext = Boolean(selectedOptionId);

  function handleSelectOption(optionId: string) {
    if (!currentQuestion || submitting || result) {
      return;
    }

    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: optionId,
    }));
  }

  function handlePreviousQuestion() {
    setCurrentQuestionIndex((currentIndex) =>
      Math.max(0, currentIndex - 1)
    );
  }

  function handleNextQuestion() {
    if (!canGoNext) {
      return;
    }

    setCurrentQuestionIndex((currentIndex) =>
      Math.min(totalQuestions - 1, currentIndex + 1)
    );
  }

  async function handleSubmitQuiz() {
    if (submitting || result) {
      return;
    }

    if (answeredQuestionsCount !== totalQuestions) {
      setError("Responda todas as perguntas antes de enviar.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formattedAnswers: QuizAnswer[] = questions.map((question) => ({
        quizId: question.id,
        optionId: answers[question.id],
      }));

      const quizResult = await submitLessonQuiz(
  lessonId,
  formattedAnswers
);

setResult(quizResult);

window.scrollTo({
  top: 0,
  behavior: "smooth",
});

onCompleted?.();
    } catch (err) {
      console.error(err);
      setError("Não foi possível enviar as respostas do quiz.");
    } finally {
      setSubmitting(false);
    }
  }



  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex min-h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />

            <div>
              <p className="font-semibold text-slate-900">
                Carregando o quiz
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Preparando as perguntas desta aula.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && questions.length === 0) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-6 sm:p-8">
        <p className="font-semibold text-red-900">
          Não foi possível carregar o quiz
        </p>

        <p className="mt-2 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  if (questions.length === 0) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-8 text-center">
      <h2 className="text-xl font-black">
        Nenhum quiz disponível
      </h2>

      <p className="mt-2 text-zinc-500">
        Esta aula ainda não possui perguntas cadastradas.
      </p>
    </section>
  );
}
  if (result) {
    const percentage = result.score;
    const isPerfectScore =
      result.correctAnswers === result.totalQuestions;
    const passed = percentage >= 60;

    return (
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-red-700 via-red-600 to-red-500 px-6 py-10 text-center text-white sm:px-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            {isPerfectScore ? (
              <Trophy className="h-8 w-8" />
            ) : (
              <CheckCircle2 className="h-8 w-8" />
            )}
          </div>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-red-100">
            Quiz concluído
          </p>

          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            {isPerfectScore
              ? "Excelente trabalho!"
              : passed
                ? "Muito bem!"
                : "Continue praticando!"}
          </h2>

          <p className="mt-3 text-red-50">
            Você concluiu o quiz desta aula.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5 text-center">
              <p className="text-sm font-medium text-slate-500">
                Resultado
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {result.score}%
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 text-center">
              <p className="text-sm font-medium text-slate-500">
                Acertos
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {result.correctAnswers}/{result.totalQuestions}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 text-center">
              <p className="text-sm font-medium text-slate-500">
                Status
              </p>

              <p
                className={`mt-2 text-lg font-bold ${
                  passed ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {passed ? "Concluído" : "Pratique novamente"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">
                  Desempenho da aula
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Você acertou {result.correctAnswers} de{" "}
                  {result.totalQuestions} perguntas.
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-700">
                {percentage}%
              </span>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-red-600 transition-all duration-700"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

        
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-600">
              Quiz da aula
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Teste o que você aprendeu
            </h2>
          </div>

          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
            {currentQuestionIndex + 1} de {totalQuestions}
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Progresso</span>
            <span>{progressPercentage}%</span>
          </div>

          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-red-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <p className="text-sm font-semibold text-slate-500">
          Pergunta {currentQuestionIndex + 1}
        </p>

        <h3 className="mt-3 text-xl font-bold leading-relaxed text-slate-900 sm:text-2xl">
          {currentQuestion.question}
        </h3>

        <div className="mt-7 space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(option.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${
                  isSelected
                    ? "border-red-600 bg-red-50 ring-2 ring-red-100"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    isSelected
                      ? "border-red-600 bg-red-600"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && (
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  )}
                </span>

                <span
                  className={`font-medium ${
                    isSelected ? "text-red-900" : "text-slate-700"
                  }`}
                >
                  {option.optionText}
                </span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 || submitting}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-5 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" />
            Anterior
          </button>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={handleSubmitQuiz}
              disabled={!canGoNext || submitting}
              className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Enviando respostas
                </>
              ) : (
                <>
                  Finalizar quiz
                  <CheckCircle2 className="h-5 w-5" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextQuestion}
              disabled={!canGoNext || submitting}
              className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Próxima
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}