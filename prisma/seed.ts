import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createRecord(entity: any, data: any) {
  let record;

  switch (entity) {
    case "student":
      record = await prisma.student.create({
        data: data,
      });
      break;
    case "admin":
      record = await prisma.admin.create({
        data: data,
      });
      break;
    case "teacher":
      record = await prisma.teacher.create({
        data: data,
      });
      break;
    case "subject":
      record = await prisma.subject.create({
        data: data,
      });
      break;
    default:
      break;
  }

  console.log(record);
}

async function main() {
  const users = [
    {
      email: "adminone@admin.com",
      lastname: "One",
      name: "Admin",
      document_number: "1313131313",
      password: bcrypt.hashSync("adminone", 5),
    },
    {
      email: "teacherone@teacher.com",
      lastname: "One",
      name: "Teacher",
      document_number: "1313131313",
      password: bcrypt.hashSync("teacherone", 5),
    },
    {
      email: "teachertwo@teacher.com",
      lastname: "Two",
      name: "Teacher",
      document_number: "1313131313",
      password: bcrypt.hashSync("teachertwo", 5),
    },
    {
      email: "studentone@student.com",
      lastname: "One",
      name: "Student",
      document_number: "1313131313",
      password: bcrypt.hashSync("studentone", 5),
    },
    {
      email: "studenttwo@student.com",
      lastname: "Two",
      name: "Student",
      document_number: "1313131313",
      password: bcrypt.hashSync("studenttwo", 5),
    },
    {
      topic: "Matematica",
      description: "Primer año",
      monthly_cost: 20,
      period: "annually",
    },
    {
      topic: "Matematica II",
      description: "Segundo año",
      monthly_cost: 20,
      period: "first_semester",
    },
    {
      topic: "Matematica III",
      description: "tercer año",
      monthly_cost: 20,
      period: "second_semester",
    },
    {
      topic: "Lengua",
      description: "Primer año",
      monthly_cost: 15,
      period: "first_semester",
    },
    {
      topic: "Lengua II",
      description: "Segundo año",
      monthly_cost: 15,
      period: "annually",
    },
    {
      topic: "Literatura III",
      description: "tercer año",
      monthly_cost: 15,
      period: "second_semester",
    },
    {
      topic: "Historia",
      description: "Primer año",
      monthly_cost: 15,
      period: "second_semester",
    },
    {
      topic: "Historia I",
      description: "Primer año",
      monthly_cost: 15,
      period: "second_semester",
    },
    {
      topic: "Historia II",
      description: "Segundo año",
      monthly_cost: 15,
      period: "second_semester",
    },
    {
      topic: "Historia III",
      description: "Segundo año",
      monthly_cost: 15,
      period: "second_semester",
    },
    {
      topic: "Biologia I",
      description: "Segundo año",
      monthly_cost: 15,
      period: "annually",
    },
    {
      topic: "Biologia II",
      description: "Tercer año",
      monthly_cost: 15,
      period: "first_semester",
    },
    {
      topic: "Biologia III",
      description: "Cuarto año",
      monthly_cost: 15,
      period: "first_semester",
    },
  ];

  users.forEach(
    async (item: any) =>
      await createRecord(item.name ? item.name.toLowerCase() : "subject", item)
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
