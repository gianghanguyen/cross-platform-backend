import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createUser = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({ data });
};

const getUser = async (data: Prisma.UserWhereUniqueInput) => {
  return await prisma.user.findUnique({ where: data });
};

const getAllUser = async () => {
  return await prisma.user.findMany();
};

const updateUser = async (where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput) => {
  return await prisma.user.update({ where, data });
};

const deleteUser = async (where: Prisma.UserWhereUniqueInput) => {
  return await prisma.user.delete({ where });
};

export { createUser, getUser, updateUser, getAllUser, deleteUser };
