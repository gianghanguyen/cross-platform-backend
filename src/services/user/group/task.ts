import { Prisma, PrismaClient } from '@prisma/client';
import {
  checkIfUserBelongsToGroup,
  checkIfUserIsGroupAdmin,
  checkIfShoppingListBelongsToGroup,
  checkIfTaskbelongsToShoppingList,
} from './auth';

const prisma = new PrismaClient();

const createTask = async (
  userId: number,
  groupId: number,
  shoppingListId: number,
  foodId: number,
  data: Prisma.TaskCreateInput,
) => {
  await checkIfShoppingListBelongsToGroup(groupId, shoppingListId);
  await checkIfUserBelongsToGroup(userId, groupId);

  return await prisma.task.create({
    data: {
      ...data,
      food: { connect: { id: foodId } },
      shoppingList: { connect: { id: shoppingListId } },
    },
  });
};

const updateTask = async (
  userId: number,
  groupId: number,
  shoppingListId: number,
  foodId: number | undefined,
  taskId: number,
  data: Prisma.TaskUpdateInput,
) => {
  await checkIfTaskbelongsToShoppingList(shoppingListId, taskId);
  await checkIfShoppingListBelongsToGroup(groupId, shoppingListId);
  await checkIfUserBelongsToGroup(userId, groupId);

  return await prisma.task.update({
    where: { id: taskId },
    data: {
      ...data,
      ...(foodId && { food: { connect: { id: foodId } } }),
    },
  });
};

const getAllTask = async (userId: number, groupId: number, shoppingListId: number) => {
  await checkIfShoppingListBelongsToGroup(groupId, shoppingListId);
  await checkIfUserBelongsToGroup(userId, groupId);

  return await prisma.task.findMany({
    where: { shoppingListId },
  });
};

const getTaskInfo = async (userId: number, groupId: number, shoppingListId: number, taskId: number) => {
  await checkIfTaskbelongsToShoppingList(shoppingListId, taskId);
  await checkIfShoppingListBelongsToGroup(groupId, shoppingListId);
  await checkIfUserBelongsToGroup(userId, groupId);

  return await prisma.task.findFirst({
    where: { id: taskId },
  });
};

const deleteTask = async (userId: number, groupId: number, shoppingListId: number, taskId: number) => {
  await checkIfTaskbelongsToShoppingList(shoppingListId, taskId);
  await checkIfShoppingListBelongsToGroup(groupId, shoppingListId);
  await checkIfUserIsGroupAdmin(userId, groupId);

  return await prisma.task.delete({
    where: { id: taskId },
  });
};

const assigneeTask = async (
  userId: number,
  groupId: number,
  shoppingListId: number,
  taskId: number,
  assigneeId: number,
) => {
  await checkIfTaskbelongsToShoppingList(shoppingListId, taskId);
  await checkIfShoppingListBelongsToGroup(groupId, shoppingListId);
  await checkIfUserIsGroupAdmin(userId, groupId);

  return await prisma.task.update({
    where: { id: taskId },
    data: {
      assignee: { connect: { id: assigneeId } },
    },
  });
};

export { createTask, updateTask, getAllTask, getTaskInfo, deleteTask, assigneeTask };
