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
    include: {
      users: true,
    }
  });
};

const addMembers = async (userId: number, groupId: number, emails: string[]) => {
  const memberIds = await Promise.all(
    emails.map(async (email) => {
      const user = await prisma.user.findUnique({ where: { email } });
      return user ? user.id : null;
    }),
  ).then((ids) => ids.filter((id) => id !== null));

  return prisma.group.update({
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
    data: {
      users: {
        create: memberIds.map((id) => ({
          userId: id,
          role: GroupRole.MEMBER,
        })),
      },
    },
    include: {
      users: true,
    },
  });
};

const removeMembers = async (userId: number, groupId: number, userIds: number[]) => {
  return prisma.group.update({
    where: {
      id: groupId,
      users: {
        some: {
          userId,
        },
      },
    },
    data: {
      users: {
        deleteMany: {
          AND: [
            {
              userId: {
                in: userIds,
              },
            },
            {
              role: GroupRole.MEMBER,
            },
          ],
        },
      },
    },
    include: {
      users: true,
    },
  });
};

export { createGroup, getGroups, groupInfo, updateGroup, deleteGroup, addMembers, removeMembers };
