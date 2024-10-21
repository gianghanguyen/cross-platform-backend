import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createUnitOfMeasure = async (data: Prisma.UnitOfMeasureCreateInput) => {
  return await prisma.unitOfMeasure.create({ data });
};

const getUnitOfMeasure = async (data: Prisma.UnitOfMeasureWhereUniqueInput) => {
  return await prisma.unitOfMeasure.findUnique({ where: data });
};

const getAllUnitOfMeasure = async () => {
  return await prisma.unitOfMeasure.findMany();
};

const updateUnitOfMeasure = async (
  where: Prisma.UnitOfMeasureWhereUniqueInput,
  data: Prisma.UnitOfMeasureUpdateInput,
) => {
  return await prisma.unitOfMeasure.update({ where, data });
};

const deleteUnitOfMeasure = async (where: Prisma.UnitOfMeasureWhereUniqueInput) => {
  return await prisma.unitOfMeasure.delete({ where });
};

export { createUnitOfMeasure, getUnitOfMeasure, updateUnitOfMeasure, getAllUnitOfMeasure, deleteUnitOfMeasure };
