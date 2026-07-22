import type { Lesson, Module } from "./course";

export interface StudentLesson extends Lesson {
  completed: boolean;
  progressPercentage: number;
  unlocked: boolean;
  recommended: boolean;
}

export interface StudentModule extends Omit<Module, "lessons"> {
  lessons: StudentLesson[];

  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}

export interface StudentCourse {
  modules: StudentModule[];

  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;

  nextLessonId: string | null;
  nextLessonNumber: number | null;
}