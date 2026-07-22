import { redirect } from "next/navigation";

import { getDashboard } from "@/lib/services/dashboard.service";

const COURSE_ID =
  "8b5ac23c-cdec-4c3f-954d-30f68c009777";

export default async function LessonOfTheDayPage() {
  const dashboard = await getDashboard(COURSE_ID);

  if (dashboard.nextLesson) {
    redirect(
      `/dashboard/aulas/${dashboard.nextLesson.number}`
    );
  }

  redirect("/dashboard/progresso");
}