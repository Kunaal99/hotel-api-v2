import fastify from "fastify";
import pino from "pino";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import { sequelize, checkDatabaseConnection } from "./plugins/sequelize";

dotenv.config();
import registerRoutes from "./routes";
const app = fastify({
  logger: pino({ level: "info" }),
});
dotenv.config();
app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
app.get("/", async (request, reply) => {
  reply.send({ message: "Welcome to v2-hotel-mgm service" });
});

app.register(registerRoutes);

let port = 8002;
const start = async () => {
  try {
    const dbStatus = await checkDatabaseConnection();
    if (!dbStatus.connected) {
      throw new Error(dbStatus.message);
    }
    await app.listen({ port: port, host: "0.0.0.0" }, (err) => {
      if (err) throw err;
    });

    app.log.info(`Server listening on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
