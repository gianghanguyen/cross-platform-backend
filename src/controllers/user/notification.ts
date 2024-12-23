import e, { Router } from 'express';
import 'express-async-errors';
import { CustomRequest, tokenExtractor } from '~/middlewares/auth';
import httpStatus from 'http-status-codes';
import { saveNotificationToken, sendTestNotification } from '~/services/user/notification';

const notificationTokenRouter = Router();
notificationTokenRouter.use(tokenExtractor('USER'));

notificationTokenRouter.post('/', async (req: CustomRequest, res) => {
  const userId = Number(req.user!.id);
  console.log(req.body);
  const { token } = req.body;
  const notificationToken = await saveNotificationToken(userId, token.data);
  res.status(httpStatus.CREATED).json(notificationToken);
});

notificationTokenRouter.post('/test', async (req, res) => {
  await sendTestNotification();
  res.status(httpStatus.OK).json('Send test done');
})

export default notificationTokenRouter;
