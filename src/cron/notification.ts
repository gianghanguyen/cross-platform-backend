import cron from 'node-cron';
import { notifyExpiredItems } from '../services/user/notification';

cron.schedule('48 16 * * *', async () => {
  await notifyExpiredItems();
});
