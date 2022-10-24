import {  PrismaClient } from "@prisma/client";
import { SUBJECTS_PER_TEACHER } from "src/configs/settings";
import { TypeSubject } from "src/types/types";

export default class SubjectRules {
  

  private static async LIMIT_PER_TEACHER(teacher_id: number) {
    const prisma = new PrismaClient();

    const subjects = await prisma.subject.findMany({
        where: {
            teacher_id: teacher_id
        }
    });

    if(subjects.length == SUBJECTS_PER_TEACHER){
        return false;
    }

    return true;
  }

  private static LIMIT_PER_STUDENT(student_id: number) {}

  public static async UPDATE(data: Partial<TypeSubject>) {

    let isValid = true;

    if (data.teacher_id) {
      isValid = await this.LIMIT_PER_TEACHER(data.teacher_id as number);
    }

    if(!isValid){
        throw new Error("error");
    }

    return isValid;
    
  }
}
