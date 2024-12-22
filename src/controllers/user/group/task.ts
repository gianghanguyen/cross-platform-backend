import { Response, Router } from 'express';
import { tokenExtractor, CustomRequest } from '~/middlewares/auth';
import {
  createTask,
  updateTask,
  getAllTask,
  getTaskInfo,
  deleteTask,
  assigneeTask,
  markTaskAsDoneOrUndone,
} from '~/services/user/group/task';
import 'express-async-errors';
import httpStatus from 'http-status-codes';

const taskRouter = Router();
taskRouter.use(tokenExtractor('USER'));

taskRouter.post('/', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId, shoppingListId, foodId, ...data } = req.body;
  const task = await createTask(userId, groupId, shoppingListId, foodId, data);
  res.status(httpStatus.CREATED).json(task);
});

taskRouter.get('/', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId, shoppingListId } = req.body;
  const tasks = await getAllTask(userId, groupId, shoppingListId);
  res.status(httpStatus.OK).json(tasks);
});

taskRouter.get('/:id', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId, shoppingListId } = req.body;
  const taskId = Number(req.params.id);
  const task = await getTaskInfo(userId, groupId, shoppingListId, taskId);
  res.status(httpStatus.OK).json(task);
});

taskRouter.patch('/:id', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId, shoppingListId, foodId, ...data } = req.body;
  const taskId = Number(req.params.id);
  const task = await updateTask(userId, groupId, shoppingListId, foodId, taskId, data);
  res.status(httpStatus.OK).json(task);
});

taskRouter.delete('/:id', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId, shoppingListId } = req.body;
  const taskId = Number(req.params.id);
  await deleteTask(userId, groupId, shoppingListId, taskId);
  res.status(httpStatus.OK).json();
});

taskRouter.patch('/:id/assign-task', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId, shoppingListId, assigneeId } = req.body;
  const taskId = Number(req.params.id);
  const task = await assigneeTask(userId, groupId, shoppingListId, taskId, assigneeId);
  res.status(httpStatus.OK).json(task);
});

taskRouter.patch('/:id/mark-task', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId, shoppingListId, isDone } = req.body;
  const taskId = Number(req.params.id);
  const task = await markTaskAsDoneOrUndone(userId, groupId, shoppingListId, taskId, isDone);
  res.status(httpStatus.OK).json(task);
});

export default taskRouter;
