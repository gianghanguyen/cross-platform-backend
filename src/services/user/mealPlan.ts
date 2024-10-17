import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createMealPlan = async (data: {
  creatorId: number;
  name: string;
  timestamp: Date;
  status: string;
  foodIds: number[];
}) => {
  return await prisma.mealPlan.create({
    data: {
      name: data.name,
      timestamp: data.timestamp,
      creatorId: data.creatorId,
      status: data.status === 'DONE' ? 'DONE' : 'NOT_PASS_YET',
      foods: {
        connect: data.foodIds.map((id) => ({ id })),
      },
    },
    include: {
      foods: true,
    },
  });
};

const findMealPlanById = async (userId: number, id: number) => {
  return await prisma.mealPlan.findUnique({
    where: { id, creatorId: userId },
    include: {
      foods: true,
    },
  });
};

const findMealPlans = async (userId: number, date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await prisma.mealPlan.findMany({
    where: {
      creatorId: userId,
      timestamp: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    include: {
      foods: true,
    },
  });
};

const updateMealPlan = async (userId: number, id: number, data: { foodIds?: number[]; [key: string]: any }) => {
  const { foodIds, ...rest } = data;
  return await prisma.mealPlan.update({
    where: {
      id,
      creatorId: userId,
    },
    data: {
      ...rest,
      foods: {
        connect: foodIds ? foodIds.map((id) => ({ id })) : undefined,
      },
    },
    include: {
      foods: true,
    },
  });
};

const deleteMealPlan = async (userId: number, id: number) => {
  await prisma.mealPlan.delete({
    where: {
      id,
      creatorId: userId,
    },
  });
};
export { createMealPlan, findMealPlanById, findMealPlans, updateMealPlan, deleteMealPlan };
