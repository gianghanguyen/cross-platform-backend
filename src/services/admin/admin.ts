import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createAdmin = async (data: Prisma.AdminCreateInput) => {
  return prisma.admin.create({ data });
};

const findAdmin = async (where: Prisma.AdminWhereUniqueInput) => {
  return prisma.admin.findUnique({ where });
};

const updateAdmin = async (where: Prisma.AdminWhereUniqueInput, data: Prisma.AdminUpdateInput) => {
  return prisma.admin.update({ where, data });
};

export { createAdmin, findAdmin, updateAdmin };
