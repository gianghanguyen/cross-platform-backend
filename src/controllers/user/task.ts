import { Response, Router } from 'express';
import { tokenExtractor, CustomRequest } from '~/middlewares/auth';
import {
  createUserTask,
  updateUserTask,
  getAllUserTask,
  getUserTaskInfo,
  deleteUserTask,
  markUserTaskAsDoneOrUndone,
} from '~/services/user/task';
import 'express-async-errors';
import httpStatus from 'http-status-codes';

const userTaskRouter = Router();
userTaskRouter.use(tokenExtractor('USER'));

userTaskRouter.post('/', async (req: CustomRequest, res: Response) => {
  const { shoppingListId, foodId, ...data } = req.body;
  const task = await createUserTask(shoppingListId, foodId, data);
  res.status(httpStatus.CREATED).json(task);
});

userTaskRouter.get('/', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { shoppingListId } = req.body;
  const tasks = await getAllUserTask(userId, shoppingListId);
  res.status(httpStatus.OK).json(tasks);
});

userTaskRouter.get('/:id', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { shoppingListId } = req.body;
  const taskId = Number(req.params.id);
  const task = await getUserTaskInfo(userId, shoppingListId, taskId);
  res.status(httpStatus.OK).json(task);
});

userTaskRouter.patch('/:id', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { shoppingListId, foodId, ...data } = req.body;
  const taskId = Number(req.params.id);
  const task = await updateUserTask(userId, shoppingListId, foodId, taskId, data);
  res.status(httpStatus.OK).json(task);
});

userTaskRouter.delete('/:id', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { shoppingListId } = req.body;
  const taskId = Number(req.params.id);
  await deleteUserTask(userId, shoppingListId, taskId);
  res.status(httpStatus.OK).json();
});

userTaskRouter.patch('/:id/mark-task', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { shoppingListId, isDone } = req.body;
  const taskId = Number(req.params.id);
  const task = await markUserTaskAsDoneOrUndone(userId, shoppingListId, taskId, isDone);
  res.status(httpStatus.OK).json(task);
});

export default userTaskRouter;
