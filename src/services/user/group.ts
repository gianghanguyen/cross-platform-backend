import { GroupRole, Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createGroup = async (data: Prisma.GroupCreateInput, userId: number) => {
  return prisma.group.create({
    data: {
      ...data,
      users: {
        create: {
          role: GroupRole.ADMIN,
          userId,
        },
      },
    },
    include: {
      users: true,
    },
  });
};

const getGroups = async (userId: number) => {
  return prisma.group.findMany({
    where: {
      users: {
        some: {
          userId,
        },
      },
    },
    include: {
      users: true,
    },
  });
};

const groupInfo = async (groupId: number, userId: number) => {
  return prisma.group.findFirst({
    where: {
      id: groupId,
      users: {
        some: {
          userId,
        },
      },
    },
    include: {
      users: true,
    },
  });
};

const deleteGroup = async (groupId: number, userId: number) => {
  await prisma.group.delete({
    where: {
      id: groupId,
      users: {
        some: {
          AND: [
            {
              userId,
            },
            {
              role: GroupRole.ADMIN,
            },
          ],
        },
      },
    },
  });
};

const updateGroup = async (groupId: number, userId: number, data: Prisma.GroupUpdateInput) => {
  return prisma.group.update({
    where: {
      id: groupId,
      users: {
        some: {
          userId,
        },
      },
    },
    data,
  });
};

const manageMember = async (groupId: number, memberIds: number[], userId: number, action: 'ADD' | 'REMOVE') => {
  const data = {
    users: {
      [action === 'ADD' ? 'create' : 'deleteMany']: memberIds.map((id) => ({
        userId: id,
        role: GroupRole.MEMBER,
      })),
    },
  };
  await prisma.group.update({
    where: {
      id: groupId,
      users: {
        some: {
          AND: [
            {
              userId,
            },
            {
              role: GroupRole.ADMIN,
            },
          ],
        },
      },
    },
    data,
  });
};

export { createGroup, getGroups, groupInfo, updateGroup, deleteGroup, manageMember };
