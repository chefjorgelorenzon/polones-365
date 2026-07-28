import { createClient } from "@/lib/supabase/client";
import type {
  QuizAnswer,
  QuizAttemptResult,
  QuizQuestion,
} from "@/types/quiz";

type QuizRow = {
  quiz_id: string;
  question: string;
  explanation: string | null;
  question_position: number;
  option_id: string;
  option_text: string;
  option_position: number;
};

type QuizAttemptRow = {
  attempt_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  completed_at: string;
};

export async function getLessonQuiz(
  lessonId: string
): Promise<QuizQuestion[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_lesson_quiz", {
    p_lesson_id: lessonId,
  });

  if (error) {
    console.error("Erro ao buscar quiz da aula:", error);
    throw new Error("Não foi possível carregar o quiz desta aula.");
  }

  const rows = (data ?? []) as QuizRow[];
  const groupedQuestions = new Map<string, QuizQuestion>();

  for (const row of rows) {
    const existingQuestion = groupedQuestions.get(row.quiz_id);

    if (existingQuestion) {
      existingQuestion.options.push({
        id: row.option_id,
        optionText: row.option_text,
        position: row.option_position,
      });

      continue;
    }

    groupedQuestions.set(row.quiz_id, {
      id: row.quiz_id,
      question: row.question,
      explanation: row.explanation,
      position: row.question_position,
      options: [
        {
          id: row.option_id,
          optionText: row.option_text,
          position: row.option_position,
        },
      ],
    });
  }

  return Array.from(groupedQuestions.values())
    .sort((a, b) => a.position - b.position)
    .map((question) => ({
      ...question,
      options: [...question.options].sort(
        (a, b) => a.position - b.position
      ),
    }));
}

export async function getLessonQuizResult(
  lessonId: string
): Promise<QuizAttemptResult | null> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "get_lesson_quiz_result",
    {
      p_lesson_id: lessonId,
    }
  );

  if (error) {
    console.error("Erro ao buscar resultado do quiz:", error);
    throw new Error("Não foi possível buscar o resultado do quiz.");
  }

  const rows = (data ?? []) as QuizAttemptRow[];
  const result = rows[0];

  if (!result) {
    return null;
  }

  return {
    attemptId: result.attempt_id,
    score: result.score,
    correctAnswers: result.correct_answers,
    totalQuestions: result.total_questions,
    completedAt: result.completed_at,
  };
}

export async function submitLessonQuiz(
  lessonId: string,
  answers: QuizAnswer[]
): Promise<QuizAttemptResult> {
  const supabase = createClient();

  const payload = answers.map((answer) => ({
    quiz_id: answer.quizId,
    option_id: answer.optionId,
  }));

  const { data, error } = await supabase.rpc(
    "submit_lesson_quiz",
    {
      p_lesson_id: lessonId,
      p_answers: payload,
    }
  );

  if (error) {
    console.error("Erro ao enviar quiz:", error);
    throw new Error("Não foi possível enviar as respostas do quiz.");
  }

  const rows = (data ?? []) as QuizAttemptRow[];
  const result = rows[0];

  if (!result) {
    throw new Error("O resultado do quiz não foi retornado.");
  }

  return {
    attemptId: result.attempt_id,
    score: result.score,
    correctAnswers: result.correct_answers,
    totalQuestions: result.total_questions,
    completedAt: result.completed_at,
  };
}