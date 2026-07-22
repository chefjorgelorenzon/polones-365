import LessonsLibrary from "@/components/library/LessonsLibrary";
import { getStudentCourse } from "@/lib/services/student-course.service";

const COURSE_ID = "8b5ac23c-cdec-4c3f-954d-30f68c009777";

export default async function LessonsPage() {
  const studentCourse = await getStudentCourse(COURSE_ID);

  return (
    <LessonsLibrary
      initialCourse={studentCourse}
    />
  );
}