
import { FastifyInstance } from "fastify";
import userRoutes from "./user.routes";
import verifyToken from "../middlewares/verifyToken";

const basePrefix = "/hotel/v1/api";

export default async function (app: FastifyInstance) {
  app.addHook("onRequest", async (req, reply) => {
    const publicRoutes = [`${basePrefix}/user/login`];
    if (!publicRoutes?.includes(req.routerPath || "")) {
      return verifyToken(req, reply);
    }
  });

  app.register(userRoutes, { prefix:`${basePrefix}` });
}
