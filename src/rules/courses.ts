import { PrismaClient } from "@prisma/client";
import { SUBJECTS_PER_STUDENT } from "src/configs/settings";
import { TypeCourse } from "src/types/types";

export default class CoursesRules {

  private  static async LIMIT_PER_STUDENT(student_id: number) {
    const prisma = new PrismaClient();

    const subjects = await prisma.course.findMany({
      where: {
        student_id: student_id,
      },
    });

    if (subjects.length == SUBJECTS_PER_STUDENT) {
      throw new Error("This student cannot assign to this subject.");
    }

    return true;
  }

  public static async CREATE(data: Partial<TypeCourse>) {

    if (data.student_id) {
      await this.LIMIT_PER_STUDENT(
        data.student_id as number
      );
    }

    return true;
  }

}
