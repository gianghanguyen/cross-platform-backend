import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createFood = async (data: Prisma.FoodCreateInput) => {
  return await prisma.food.create({ data });
};

const getAllFoodByUser = async (userId: number) => {
  return await prisma.food.findMany({
    where: {
      userId,
    },
  });
};

const getFood = async (where: Prisma.FoodWhereUniqueInput) => {
  return await prisma.food.findUnique({ where });
};

const updateFood = async (where: Prisma.FoodWhereUniqueInput, data: Prisma.FoodUpdateInput) => {
  return await prisma.food.update({ where, data });
};

const deleteFood = async (where: Prisma.FoodWhereUniqueInput) => {
  return await prisma.food.delete({ where });
};

export { createFood, getFood, updateFood, getAllFoodByUser, deleteFood };
