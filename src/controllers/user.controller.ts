import { FastifyRequest, FastifyReply } from "fastify";
import UserModel from "../models/userModel";
import { paginate, sendResponse } from "../utils/paginator";
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { authConfig } from "../config/auth";
export const createUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { password, ...rest } = req.body as any;
    if (!password) {
      return sendResponse(reply, 400, "Password is required");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      ...rest,
      password: hashedPassword,
    });
    sendResponse(reply, 201, "User created successfully", {
      id: user.id,
      name: user.name,
    });
  } catch (err) {
    sendResponse(reply, 500, "Failed to create user", err);
  }
};

export const getUsers = async (req: any, reply: FastifyReply) => {
  try {
    const { page, limit, name, phone_no } = req.query as {
      page?: number;
      limit?: number;
      name?: string;
      phone_no?: number
    };
    const filter: any = {};
    if (name) filter.name = name;
    if (phone_no) filter.phone_no = phone_no;
    const paginatedResult = await paginate(UserModel, {
      page,
      limit,
      filter,
    });
    sendResponse(reply, 200, `${paginatedResult?.items?.length ? 'Users fetched successfully' : "No records found"}`, paginatedResult)
  } catch (err) {
    reply.code(500).send({
      statusCode: 500,
      message: "Failed to fetch users",
      error: err,
    });
  }
};


export const getUserById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const user = await UserModel.findByPk(req.params.id);
    user
      ? sendResponse(reply, 200, "User fetched successfully", user)
      : sendResponse(reply, 404, "User not found");
  } catch (err) {
    sendResponse(reply, 500, "Error fetching user", err);
  }
};


export const updateUser = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const [updated] = await UserModel.update(req.body as any, {
      where: { id: req.params.id },
    });

    if (updated) {
      const user = await UserModel.findByPk(req.params.id);
      sendResponse(reply, 200, "User updated successfully", user);
    } else {
      sendResponse(reply, 404, "User not found");
    }
  } catch (err) {
    sendResponse(reply, 500, "Failed to update user", err);
  }
};

export const deleteUser = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const deleted = await UserModel.destroy({ where: { id: req.params.id } });
    deleted
      ? sendResponse(reply, 200, "User deleted successfully")
      : sendResponse(reply, 404, "User not found");
  } catch (err) {
    sendResponse(reply, 500, "Failed to delete user", err);
  }
};

export const login = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { password, phone_no } = req.body as {
      password: string;
      phone_no: number;
    };

    if (!password) return sendResponse(reply, 400, "Password is required");
    if (!phone_no) return sendResponse(reply, 400, "Phone number is required");
    const user = await UserModel.findOne({ where: { phone_no } });
    if (!user) return sendResponse(reply, 404, "User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendResponse(reply, 401, "Invalid credentials");

    const SECRET_KEY = {
      ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET || authConfig?.auth?.REFRESH_SECRET_KEY,
      REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET || authConfig?.auth?.REFRESH_SECRET_KEY,
    }

    const accessToken = jsonwebtoken.sign(
      { id: user.id, phone_no },
      SECRET_KEY.ACCESS_SECRET_KEY,
      { expiresIn: "2m" }
    );

    const refreshToken = jsonwebtoken.sign(
      { id: user.id, phone_no },
      SECRET_KEY.REFRESH_SECRET_KEY,
      { expiresIn: "2d" }
    );
    return sendResponse(reply, 200, "Login successful", {
      accessToken,
      refreshToken,
      secretKey: SECRET_KEY,
      tokenType: authConfig?.auth?.TOKEN_TYPE
    });
  } catch (err) {
    return sendResponse(reply, 500, "Failed to login user", err);
  }
};
