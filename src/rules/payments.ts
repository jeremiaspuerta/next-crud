import { PrismaClient } from "@prisma/client";
import { TypeCourse } from "src/types/types";
import { datetime } from "src/utils/datetime";

export default class PaymentsRules {
  private static async LIMIT(student_id: number, subject_id: number) {
    
    const prisma = new PrismaClient();
    
    const currentMonth = datetime.get('month');

    const paymentThisMonth = await prisma.$queryRaw`SELECT * FROM Payment p WHERE MONTH(p.created_at) = ${currentMonth} 
    AND subject_id = ${subject_id} AND student_id = ${student_id}`;

    if (!paymentThisMonth) {
      throw new Error('This month is payed already');
    }

    const totallyPayed: any[] = await prisma.$queryRaw`SELECT 
    CASE
      WHEN s.period = 'annually' AND COUNT(p.id) < 12 THEN false
        WHEN s.period != 'annually' AND COUNT(p.id) < 6 THEN false
        ELSE true
    END as totally_payed
    FROM Payment p
    INNER JOIN Subject s ON s.id = p.subject_id
    WHERE p.student_id = ${student_id}
    AND p.subject_id = ${subject_id}
    GROUP BY p.subject_id`  ;

    const { totally_payed } = totallyPayed[0];

    if(totally_payed){
      throw new Error('This subject was totally payed');
    }

    return true;
  }

  public static async CREATE(data: Partial<TypeCourse>) {


    if (data.student_id && data.subject_id) {
      await this.LIMIT(data.student_id, data.subject_id);
    }

    return true;
  }
}
