import NextCrud, { PrismaAdapter } from "@premieroctet/next-crud";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import bcrypt from "bcrypt";
import SubjectRules from "src/rules/subjects";


const prismaClient = new PrismaClient();

const handler = async (req: any, res: any) => {
  const nextCrudHandler = await NextCrud({
    adapter: new PrismaAdapter({
      prismaClient: prisma,
    }),
    async onRequest(req, res, route) {

      const { body, url } = req;

      if (body.password) {
        body.password = bcrypt.hashSync(body.password, 5);
      }

      if(route){

        if(route.resourceName == 'subjects' && route.routeType == 'UPDATE' ){
          await SubjectRules[route.routeType](body);          
        }

      }

    }
  });
  return nextCrudHandler(req, res);
};

export default handler;
