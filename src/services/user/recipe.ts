import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createRecipe = async (
  data: { name: string; description: string; htmlContent: string; foodIds: number[] },
  userId: number,
) => {
  try {
    console.log("description", data.description);
    const recipe = await prisma.recipe.create({
      data: {
        name: data.name,
        description: data.description,
        htmlContent: data.htmlContent,
        foods: {
          connect: data.foodIds.map((id: number) => ({ id: Number(id) })),
        },
        creator: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        creator: true,
        foods: true,
      },
    });
    return recipe;
  } catch (error) {
    console.log(error);
  }
};

const findRecipeById = async (id: number) => {
  return await prisma.recipe.findUnique({
    where: {
      id,
    },
    include: {
      creator: true,
      foods: true,
    },
  });
};

const findRecipes = async (userId: number) => {
  return prisma.recipe.findMany({
    where: {
      creatorId: userId,
    },
    include: {
      creator: true,
      foods: true,
    },
  });
};

const updateRecipe = async (id: number, userId: number, data: { foodIds?: number[]; [key: string]: any }) => {
  return await prisma.recipe.update({
    where: {
      id,
      creatorId: userId,
    },
    data: {
      foods: {
        connect: data.foodIds ? data.foodIds.map((id) => ({ id })) : undefined,
      },
    },
    include: {
      creator: true,
      foods: true,
    },
  });
};

const deleteRecipe = async (id: number, userId: number) => {
  await prisma.recipe.delete({
    where: {
      id,
      creatorId: userId,
    },
  });
};

export { createRecipe, findRecipes, findRecipeById, updateRecipe, deleteRecipe };
