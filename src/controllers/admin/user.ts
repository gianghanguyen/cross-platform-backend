import { Router } from 'express';
import { deactivateUser } from '~/services/admin/user';
import { tokenExtractor } from '~/middlewares/auth';

const adminUserRouter = Router();
adminUserRouter.use(tokenExtractor('ADMIN'));

adminUserRouter.patch('/deactivate', async (req, res) => {
  const { id } = req.body;
  await deactivateUser({ id });
  res.status(200).json();
});

export default adminUserRouter;
