import { Prisma, PrismaClient } from '@prisma/client';
import { checkIfTaskbelongsToShoppingList, checkIfUserIsCreatorOfShoppingList } from './group/auth';

const prisma = new PrismaClient();

const createUserTask = async (shoppingListId: number, foodId: number | undefined, data: Prisma.TaskCreateInput) => {
  return await prisma.task.create({
    data: {
      ...data,
      shoppingList: { connect: { id: shoppingListId } },
      ...(foodId && { food: { connect: { id: foodId } } }),
    },
  });
};

const updateUserTask = async (
  userId: number,
  shoppingListId: number,
  foodId: number | undefined,
  taskId: number,
  data: Prisma.TaskUpdateInput,
) => {
  await checkIfTaskbelongsToShoppingList(shoppingListId, taskId);
  await checkIfUserIsCreatorOfShoppingList(userId, shoppingListId);

  return await prisma.task.update({
    where: { id: taskId },
    data: {
      ...data,
      ...(foodId && { food: { connect: { id: foodId } } }),
    },
  });
};

const getAllUserTask = async (userId: number, shoppingListId: number) => {
  await checkIfUserIsCreatorOfShoppingList(userId, shoppingListId);
  return await prisma.task.findMany({
    where: { shoppingListId },
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

const getUserTaskInfo = async (userId: number, shoppingListId: number, taskId: number) => {
  await checkIfTaskbelongsToShoppingList(shoppingListId, taskId);
  await checkIfUserIsCreatorOfShoppingList(userId, shoppingListId);

  return await prisma.task.findUnique({
    where: { id: taskId },
  });
};

const deleteUserTask = async (userId: number, shoppingListId: number, taskId: number) => {
  await checkIfTaskbelongsToShoppingList(shoppingListId, taskId);
  await checkIfUserIsCreatorOfShoppingList(userId, shoppingListId);

  return await prisma.task.delete({
    where: { id: taskId },
  });
};

const markUserTaskAsDoneOrUndone = async (userId: number, shoppingListId: number, taskId: number, isDone: boolean) => {
  await checkIfTaskbelongsToShoppingList(shoppingListId, taskId);
  await checkIfUserIsCreatorOfShoppingList(userId, shoppingListId);

  return await prisma.task.update({
    where: { id: taskId },
    data: { done: isDone },
  });
};

export { createUserTask, updateUserTask, getAllUserTask, getUserTaskInfo, deleteUserTask, markUserTaskAsDoneOrUndone };
