import { PrismaClient } from "@prisma/client";
import { SUBJECTS_PER_STUDENT } from "src/configs/settings";
import { TypeCourse } from "src/types/types";

export default class PaymentsRules {

  private  static async LIMIT(student_id: number, subject_id: number) {
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
      await this.LIMIT(
        data.student_id,
        data.subject_id
      );
    }

    return true;
  }

}
