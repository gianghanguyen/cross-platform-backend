import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createUserShoppingList = async (data: Prisma.ShoppingListCreateInput, userId: number) => {
  return prisma.shoppingList.create({
    data: {
      ...data,
      user: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      task: true,
    },
  });
};

const getAllUserShoppingList = async (userId: number) => {
  return prisma.shoppingList.findMany({
    where: {
      user: {
        id: userId,
      },
      groupId: null,
    },
    include: {
      task: true,
    },
  });
};

const getUserShoppingListInfo = async (shoppingListId: number, userId: number) => {
  return prisma.shoppingList.findFirst({
    where: {
      id: shoppingListId,
      user: {
        id: userId,
      },
    },
    include: {
      task: true,
    },
  });
};

const updateUserShoppingList = async (shoppingListId: number, userId: number, data: Prisma.ShoppingListUpdateInput) => {
  return prisma.shoppingList.update({
    where: {
      id: shoppingListId,
      user: {
        id: userId,
      },
    },
    data,
    include: {
      task: true,
    },
  });
};

const deleteUserShoppingList = async (shoppingListId: number, userId: number) => {
  return prisma.shoppingList.delete({
    where: {
      id: shoppingListId,
      user: {
        id: userId,
      },
    },
  });
};

export {
  createUserShoppingList,
  getAllUserShoppingList,
  getUserShoppingListInfo,
  updateUserShoppingList,
  deleteUserShoppingList,
};
