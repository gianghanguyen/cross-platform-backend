import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createRecipe = async (
  data: { name: string; description: string; htmlContent: string; foodIds: number[] },
  userId: number,
) => {
  return prisma.recipe.create({
    data: {
      name: data.name,
      description: data.description,
      htmlContent: data.htmlContent,
      foods: {
        connect: data.foodIds.map((id: number) => ({ id })),
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
};

const findRecipesById = async (id: number) => {
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

const findRecipes = async (query: Prisma.RecipeFindManyArgs) => {
  return await prisma.recipe.findMany(query);
};

const updateRecipe = async (id: number, userId: number, data: Prisma.RecipeUpdateInput) => {
  return await prisma.recipe.update({
    where: {
      id,
      creatorId: userId,
    },
    data,
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

export { createRecipe, findRecipes, findRecipesById, updateRecipe, deleteRecipe };
