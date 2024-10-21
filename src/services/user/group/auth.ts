import { GroupRole, PrismaClient } from '@prisma/client';
import ApiError from '~/utils/api-error';
import httpStatus from 'http-status-codes';

const prisma = new PrismaClient();

const checkIfUserBelongsToGroup = async (userId: number, groupId: number) => {
  const userGroup = await prisma.userGroup.findFirst({
    where: {
      groupId,
    },
  });

  if (!userGroup) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User does not belong to this group');
  }
};

const checkIfUserIsGroupAdmin = async (userId: number, groupId: number) => {
  const userGroup = await prisma.userGroup.findFirst({
    where: {
      userId,
      groupId,
      role: GroupRole.ADMIN,
    },
  });

  if (!userGroup) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Only group admins can perform this action');
  }
};

const checkIfShoppingListBelongsToGroup = async (groupId: number, shoppingListId: number) => {
  const shoppingList = await prisma.shoppingList.findFirst({
    where: {
      id: shoppingListId,
      groupId,
    },
  });
  if (!shoppingList) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Shopping list does not belong to this group');
  }
};

const checkIfTaskbelongsToShoppingList = async (shoppingListId: number, taskId: number) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      shoppingListId,
    },
  });

  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
};

export {
  checkIfUserBelongsToGroup,
  checkIfUserIsGroupAdmin,
  checkIfShoppingListBelongsToGroup,
  checkIfTaskbelongsToShoppingList,
};
