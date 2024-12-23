import { Expo } from 'expo-server-sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const expo = new Expo();

export const saveNotificationToken = async (userId: number, token: string) => {
  return prisma.notificationToken.upsert({
    where: {
      token,
    },
    create: {
      userId,
      token,
    },
    update: {
      userId,
    },
  });
};

export const sendNotification = async (pushTokens: string[], title: string, body: string) => {
  const messages = pushTokens.map((token) => ({
    to: token,
    sound: 'default',
    title,
    body,
  }));
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }
  console.log(tickets);
  return tickets;
};

export const notifyExpiredItems = async () => {
  const today = new Date();
  try {
    const expiredItems = await prisma.fridgeItem.findMany({
      where: {
        expiredDate: {
          lte: today,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            notificationToken: {
              select: {
                token: true,
              },
            },
          },
        },
        food: true,
      },
    });

    const pushTokens = expiredItems
      .map((item) => item.user?.notificationToken)
      .flat()
      .map((token) => token.token);

    for (const item of expiredItems) {
      const { user, food } = item;
      if (user && food) {
        const title = 'Fridge Item Expired';
        const body = `Your item "${food.name}" has expired on ${item.expiredDate.toLocaleDateString()}.`;
        await sendNotification(pushTokens, title, body);
      }
    }
    console.log('Expired item notifications sent successfully.');
  } catch (error) {
    console.error('Error while sending expired item notifications:', error);
  }
};

export async function sendTestNotification() {
  const users = await prisma.user.findMany({
    include: {
      notificationToken: true,
    },
  });
  const pushTokens = users
    .map((user) => user.notificationToken)
    .flat()
    .map((token) => token.token);
  await sendNotification(pushTokens, 'Test Notification', 'This is a test notification');
}
