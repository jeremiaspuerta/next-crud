import NextCrud, { PrismaAdapter } from "@premieroctet/next-crud";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import bcrypt from "bcrypt";

const prismaClient = new PrismaClient();

const handler = async (req: any, res: any) => {
  const nextCrudHandler = await NextCrud({
    adapter: new PrismaAdapter({
      prismaClient: prisma,
    }),
    onRequest(req, res, options) {
      const { body, url } = req;

      if (body.password) {
        body.password = bcrypt.hashSync(body.password, 5);
      }

    }
  });
  return nextCrudHandler(req, res);
};

export default handler;
