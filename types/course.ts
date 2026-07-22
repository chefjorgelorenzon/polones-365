export type LessonStatus =
  | "locked"
  | "available"
  | "completed";

export type Lesson = {
  id: string;

  course_id: string;
  module_id: string;

  title: string;
  slug: string;

  short_description: string | null;
  content: string | null;

  lesson_number: number;
  release_day: number;

  duration_minutes: number | null;

  position: number;

  video_path: string | null;
  exercise_pdf_path: string | null;
  thumbnail_path: string | null;

  is_published: boolean;

  status: LessonStatus;
};

export type Module = {
  id: string;

  course_id: string;

  title: string;
  description: string | null;

  position: number;
  release_month: number;

  is_published: boolean;

  lessons: Lesson[];
};