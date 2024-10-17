import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createCategory = async (data: Prisma.CategoryCreateInput) => {
  return await prisma.category.create({ data });
};

const getCategory = async (data: Prisma.CategoryWhereUniqueInput) => {
  return await prisma.category.findUnique({ where: data });
};

const getAllCategory = async () => {
  return await prisma.category.findMany();
}

const updateCategory = async (where: Prisma.CategoryWhereUniqueInput, data: Prisma.CategoryUpdateInput) => {
  return await prisma.category.update({ where, data });
};

const deleteCategory = async (where: Prisma.CategoryWhereUniqueInput) => {
  return await prisma.category.delete({ where });
}

export { createCategory, getCategory, updateCategory, getAllCategory, deleteCategory };
