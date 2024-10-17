import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const deactivateUser = async (where: Prisma.UserWhereUniqueInput) => {
  return await prisma.user.update({ where, data: { isActivated: false } });
};

export { deactivateUser };
