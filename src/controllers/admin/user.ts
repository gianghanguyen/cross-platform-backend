import { Router } from 'express';
import { deactivateUser } from '~/services/admin/user';
import { tokenExtractor } from '~/middlewares/auth';
import { deleteUser, getAllUser } from '~/services/user/user';
import { getAllProfile } from '~/services/user/profile';
import httpStatus from 'http-status';

const adminUserRouter = Router();
// adminUserRouter.use(tokenExtractor('ADMIN'));

adminUserRouter.patch('/deactivate', async (req, res) => {
  const { id } = req.body;
  await deactivateUser({ id });
  res.status(httpStatus.OK).json();
});

adminUserRouter.get('/get-all-user', async (req, res) => {
  const users = await getAllUser();
  res.status(200).json(users);
});

adminUserRouter.delete('/delete-user', async (req, res) => {
  const { id } = req.body;
  await deleteUser({ id });
  res.status(200).json();
});

adminUserRouter.get('/get-all-profile', async (req, res) => {
  const profiles = await getAllProfile();
  res.status(200).json(profiles);
});

export default adminUserRouter;
