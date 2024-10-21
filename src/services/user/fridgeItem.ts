import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const createFridgeItem = async (data: Prisma.FridgeItemCreateInput) => {
  return prisma.fridgeItem.create({
    data,
  });
};

const findFridgeItems = async (query: { userId: number; page: number; limit: number }) => {
  return await prisma.fridgeItem.findMany({
    where: {
      userId: query.userId,
    },
    skip: query.page ? (query.page - 1) * query.limit : 0,
    take: query.limit ? query.limit : 10,
  });
};

const findFridgeItemById = async (id: number, userId: number) => {
  return await prisma.fridgeItem.findUnique({ where: { id, userId } });
};

const updateFridgeItem = async (id: number, userId: number, data: Prisma.FridgeItemUpdateInput) => {
  return await prisma.fridgeItem.update({
    where: {
      id,
      userId,
    },
    data,
  });
};

const deleteFridgeItem = async (id: number, userId: number) => {
  await prisma.fridgeItem.delete({
    where: {
      id,
      userId,
    },
  });
};
export { createFridgeItem, findFridgeItems, findFridgeItemById, deleteFridgeItem, updateFridgeItem };
