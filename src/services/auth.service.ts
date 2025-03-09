import { PrismaClient } from "@prisma/client";
import { RedisCacheService } from "../types/common.types.js";
import { Logger } from "../utils/logger.js";
import { BaseService } from "./base.service.js";
import { UserModel } from "../types/models/user.types.model.js";
import { prisma } from "../utils/database.js";
export class AuthService extends BaseService {
  constructor(
    logger: Logger,
    caching: RedisCacheService,
    prisma: PrismaClient
  ) {
    super(logger, caching, prisma);
  }
  createUser = async (data: Omit<UserModel, "id">): Promise<UserModel> => {
    return this.insertToDatabaseAndCache<UserModel>(
      "user",
      data,
    "User"
    );
  };
}
