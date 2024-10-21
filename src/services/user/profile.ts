import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createProfile = async (userId: number, photoURL: string, data: Prisma.ProfileCreateInput) => {
  return await prisma.profile.create({
    data: { ...data, photoURL, user: { connect: { id: userId } } },
    include: { user: true },
  });
};

const getProfile = async (userId: number) => {
  return await prisma.profile.findFirst({ where: { userId } });
};

const getAllProfile = async () => {
  return await prisma.profile.findMany();
};

const updateProfile = async (userId: number, photoURL: string | null, data: Prisma.ProfileUpdateInput) => {
  return await prisma.profile.update({
    where: { userId },
    data: {
      ...data,
      ...(photoURL !== null && { photoURL }),
    },
    include: { user: true },
  });
};

const deleteProfile = async (where: Prisma.ProfileWhereUniqueInput) => {
  return await prisma.profile.delete({ where });
};

export { createProfile, getProfile, updateProfile, getAllProfile, deleteProfile };
