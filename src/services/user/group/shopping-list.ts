import { Prisma, PrismaClient } from '@prisma/client';
import { checkIfUserBelongsToGroup, checkIfUserIsGroupAdmin, checkIfShoppingListBelongsToGroup } from './auth';

const prisma = new PrismaClient();

const createGroupShoppingList = async (userId: number, groupId: number, data: Prisma.ShoppingListCreateInput) => {
  return prisma.shoppingList.create({
    data: {
      ...data,
      user: {
        connect: {
          id: userId,
        },
      },
      group: {
        connect: {
          id: groupId,
        },
      },
    },
    include: {
      user: true,
      group: true,
    },
  });
};

const getAllGroupShoppingList = async (userId: number, groupId: number) => {
  await checkIfUserBelongsToGroup(userId, groupId);

  return prisma.shoppingList.findMany({
    where: {
      groupId,
    },
    include: {
      user: true,
      group: true,
    },
  });
};

const getGroupShoppingListInfo = async (userId: number, groupId: number, shoppingListId: number) => {
  await checkIfShoppingListBelongsToGroup(groupId, shoppingListId);
  await checkIfUserBelongsToGroup(userId, groupId);

  return prisma.shoppingList.findFirst({
    where: {
      id: shoppingListId,
      groupId,
    },
    include: {
      user: true,
      group: true,
    },
  });
};

const updateGroupShoppingList = async (
  userId: number,
  groupId: number,
  shoppingListId: number,
  data: Prisma.ShoppingListUpdateInput,
) => {
  await checkIfShoppingListBelongsToGroup(groupId, shoppingListId);
  await checkIfUserBelongsToGroup(userId, groupId);
  return prisma.shoppingList.update({
    where: {
      id: shoppingListId,
      groupId,
    },
    data,
    include: {
      user: true,
      group: true,
    },
  });
};

const deleteGroupShoppingList = async (shoppingListId: number, groupId: number, userId: number) => {
  await checkIfShoppingListBelongsToGroup(groupId, shoppingListId);
  await checkIfUserIsGroupAdmin(userId, groupId);

  return prisma.shoppingList.delete({
    where: {
      id: shoppingListId,
      groupId,
    },
  });
};

export {
  createGroupShoppingList,
  getAllGroupShoppingList,
  getGroupShoppingListInfo,
  updateGroupShoppingList,
  deleteGroupShoppingList,
};
