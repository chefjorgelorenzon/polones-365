export interface QuizOption {
  id: string;
  optionText: string;
  position: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  explanation: string | null;
  position: number;
  options: QuizOption[];
}

export interface QuizAnswer {
  quizId: string;
  optionId: string;
}

export interface QuizAttemptResult {
  attemptId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
}