import { FastifyReply } from "fastify";
import { FindAndCountOptions, ModelStatic, Model } from "sequelize";

interface PaginationOptions {
    page?: number;
    limit?: number;
    filter?: Record<string, any>;
    order?: [string, "ASC" | "DESC"][]; // Optional sorting
}

export const paginate = async <T extends Model>(
    model: ModelStatic<T>,
    options: PaginationOptions = {}
) => {
    const page = parseInt(options?.page as any) || 1;
    const limit = parseInt(options?.limit as any) || 10;
    const offset = (page - 1) * limit;

    const query: FindAndCountOptions = {
        limit,
        offset,
        where: options?.filter || {},
        order: options?.order || [["created_on", "DESC"]],
    };

    const { rows: data, count: total } = await model.findAndCountAll(query);

    return {
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        items: data
    };
};


export const sendResponse = (
    reply: FastifyReply,
    statusCode: number,
    message: string,
    data: any = null
  ) => {
    reply.code(statusCode).send({ statusCode, message, data });
  };