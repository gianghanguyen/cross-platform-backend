import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const createFridgeItem = async (data: Prisma.FridgeItemCreateInput) => {
  return prisma.fridgeItem.create({
    data,
  });
};

const findFridgeItems = async (query: { userId: number }) => {
  return await prisma.fridgeItem.findMany({
    where: {
      userId: query.userId,
    },
    include: {
      food: {
        include: {
          category: true,
          unit: true,
        },
      },
    },
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
