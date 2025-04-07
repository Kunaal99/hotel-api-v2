import { FastifyInstance } from "fastify";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
} from "../controllers/user.controller";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/users", createUser);
  fastify.post("/users/all", getUsers);
  fastify.get("/users/:id", getUserById);
  fastify.put("/users/:id", updateUser);
  fastify.delete("/users/:id", deleteUser);
  fastify.post("/user/login", login);
}
