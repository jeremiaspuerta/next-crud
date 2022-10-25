import { PrismaClient } from "@prisma/client";
import { SUBJECTS_PER_TEACHER } from "src/configs/settings";
import { PeriodEnum, TypeSubject } from "src/types/types";

export default class SubjectRules {
  private static async LIMIT_PER_TEACHER(
    teacher_id: number,
    nextPeriod: string
  ) {
    const prisma = new PrismaClient();

    let periodsFilter: any = ['annually'];

    if (nextPeriod == "first_semester" || nextPeriod == "annually") {
      periodsFilter.push('first_semester');
    }

    if (nextPeriod == "second_semester" || nextPeriod == "annually") {
      periodsFilter.push('second_semester');
    }

    const subjects = await prisma.subject.findMany({
      where: {
        teacher_id: teacher_id,
        period: {
          in: periodsFilter,
        },
      },
    });

    if (subjects.length == SUBJECTS_PER_TEACHER) {
      throw new Error("This teacher cannot assign to this subject.");
    }

    return true;
  }

  private static LIMIT_PER_STUDENT(student_id: number) {}

  public static async UPDATE(data: Partial<TypeSubject>) {


    if (data.teacher_id && data.period) {
      await this.LIMIT_PER_TEACHER(
        data.teacher_id as number,
        data.period
      );
    }

    return true;
  }
}
