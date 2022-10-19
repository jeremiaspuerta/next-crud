// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

type Data = {
  id: number;
  name: string;
  lastname: string;
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | any>
) {
  const method: string | undefined = req.method?.toUpperCase();

  if (method) {
    if (method == "GET") {
      const prisma = new PrismaClient();
      const { email, password }: any = req.query;

      let user: any;
      let user_id: number | null;

      if (email) {
        if (email.includes("teacher")) {
          user = await prisma.teacher.findFirst({
            where: {
              email: email,
            },
          });

        
        } else if (email.includes("student")) {
          user = await prisma.student.findUnique({
            where: {
              email: email,
            }
          });
        } else {
          user = await prisma.admin.findFirst({
            where: {
              email: email,
            },
          });
        }

        if (user) {
          const passIsCorrect: boolean = await bcrypt.compare(
            password,
            user.password
          );

          if (passIsCorrect) {
            res.status(200).json(user);
          } else {
            res.status(400).json({ message: "Hola" });
          }
        }else{
            res.status(400).json({ message: "hola"})
        }
      }
    }
  }
}
