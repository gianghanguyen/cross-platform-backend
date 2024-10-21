import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createFood = async (
  userId: number,
  category: string,
  unit: string,
  imageURL: string,
  data: Prisma.FoodCreateInput,
) => {
  return await prisma.food.create({
    data: {
      ...data,
      imageURL: imageURL,
      user: {
        connect: {
          id: userId,
        },
      },
      category: {
        connect: {
          name: category,
        },
      },
      unit: {
        connect: {
          name: unit,
        },
      },
    },
  });
};

const getAllFoodByUser = async (userId: number) => {
  return await prisma.food.findMany({
    where: {
      userId,
    },
  });
};

const getFood = async (foodId: number) => {
  return await prisma.food.findFirst({
    where: {
      id: foodId,
    },
  });
};

const updateFood = async (
  foodId: number,
  category: string | null,
  unit: string | null,
  imageURL: string | null,
  data: Prisma.FoodUpdateInput,
) => {
  return await prisma.food.update({
    where: {
      id: foodId,
    },
    data: {
      ...data,
      ...(category !== null && {
        category: {
          connect: {
            name: category,
          },
        },
      }),
      ...(unit !== null && {
        unit: {
          connect: {
            name: unit,
          },
        },
      }),
    },
  });
};

const deleteFood = async (foodId: number) => {
  return await prisma.food.delete({
    where: {
      id: foodId,
    },
  });
};

export { createFood, getFood, updateFood, getAllFoodByUser, deleteFood };
