import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createProfile = async (data: Prisma.ProfileCreateInput) => {
  return await prisma.profile.create({ data });
};

const getProfile = async (data: Prisma.ProfileWhereUniqueInput) => {
  return await prisma.profile.findUnique({ where: data });
};

const getAllProfile = async () => {
  return await prisma.profile.findMany();
}

const updateProfile = async (where: Prisma.ProfileWhereUniqueInput, data: Prisma.ProfileUpdateInput) => {
  return await prisma.profile.update({ where, data });
};

const deleteProfile = async (where: Prisma.ProfileWhereUniqueInput) => {
  return await prisma.profile.delete({ where });
}

export { createProfile, getProfile, updateProfile, getAllProfile, deleteProfile };
