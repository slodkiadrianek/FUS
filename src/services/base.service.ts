import { PrismaClient } from "@prisma/client";
import { Logger } from "../utils/logger.js";
import { RedisCacheService } from "../types/common.types.js";
import { AppError } from "./error.service.js";
export class BaseService {
  constructor(
    public logger: Logger,
    public caching: RedisCacheService,
    public prisma: PrismaClient
  ) {}
  insertToDatabaseAndCache = async <T extends { id: number }>(
    type: string,
    data: Omit<T, "id">,
    table: string
  ): Promise<T> => {
    const result = await this.prisma[table].create({ data });
    await this.caching.set(`${type}-${result.id}`, JSON.stringify(result), 300);
    return result;
  };
  getAllItems = async <T>(
    type: string,
    model: { findMany: () => Promise<T[]> }
  ) => {
    if (await this.caching.exists(type)) {
      const cachedData = await this.caching.get(type);
      if (cachedData) return JSON.parse(cachedData) as T[];
    }
    const result = await model.findMany();
    await this.caching.set(type, JSON.stringify(result), 300);
    return result;
  };

  getItemById = async <T extends { id: string }>(
    type: string,
    id: string,
    model: {
      findUnique: (args: { where: { id: string } }) => Promise<T | null>;
    },
    redirect: string
  ): Promise<T> => {
    const cacheKey = `${type}-${id}`;
    if (await this.caching.exists(cacheKey)) {
      const cachedData = await this.caching.get(cacheKey);
      if (cachedData) return JSON.parse(cachedData) as T;
    }
    const result = await model.findUnique({ where: { id } });
    if (!result) {
      this.logger.error(`${type} with this ID does not exist`, { id });
      throw new AppError(404, redirect, `${type} z tym ID nie istnieje`);
    }
    await this.caching.set(cacheKey, JSON.stringify(result), 300);
    return result;
  };

  updateItem = async <T extends { id: string }>(
    type: string,
    id: string,
    data: Partial<Omit<T, "id">>,
    model: {
      update: (args: {
        where: { id: string };
        data: Partial<Omit<T, "id">>;
      }) => Promise<T | null>;
    },
    redirect: string
  ): Promise<T> => {
    const result = await model.update({ where: { id }, data });
    if (!result) {
      this.logger.error(`${type} with this ID does not exist`, { id });
      throw new AppError(404, redirect, `${type} z tym ID nie istnieje`);
    }
    await this.caching.set(`${type}-${id}`, JSON.stringify(result), 300);
    return result;
  };

  deleteItem = async <T extends { id: string }>(
    type: string,
    id: string,
    model: { delete: (args: { where: { id: string } }) => Promise<T | null> },
    redirect: string
  ): Promise<string> => {
    const result = await model.delete({ where: { id } }).catch(() => null);
    if (!result) {
      this.logger.error(`${type} with this ID does not exist`, { id });
      throw new AppError(404, redirect, `${type} with this ID does not exist`);
    }
    await this.caching.del(`${type}-${id}`);
    return `${type} został pomyślnie usunięty`;
  };
}
