import { Response, Router } from 'express';
import { tokenExtractor, CustomRequest } from '~/middlewares/auth';
import {
  createGroupShoppingList,
  getAllGroupShoppingList,
  getGroupShoppingListInfo,
  updateGroupShoppingList,
  deleteGroupShoppingList,
} from '~/services/user/group/shopping-list';
import 'express-async-errors';
import httpStatus from 'http-status-codes';

const groupShoppingListRouter = Router();
groupShoppingListRouter.use(tokenExtractor('USER'));

groupShoppingListRouter.post('/', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId, ...data } = req.body;
  const shoppingList = await createGroupShoppingList(userId, groupId, data);
  res.status(httpStatus.CREATED).json(shoppingList);
});

groupShoppingListRouter.get('/', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId } = req.body;
  const shoppingLists = await getAllGroupShoppingList(userId, groupId);
  res.status(httpStatus.OK).json(shoppingLists);
});

groupShoppingListRouter.get('/:id', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId } = req.body;
  const shoppingListId = Number(req.params.id);
  const shoppingList = await getGroupShoppingListInfo(userId, groupId, shoppingListId);
  res.status(httpStatus.OK).json(shoppingList);
});

groupShoppingListRouter.put('/:id', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId, ...data } = req.body;
  const shoppingListId = Number(req.params.id);
  const shoppingList = await updateGroupShoppingList(userId, groupId, shoppingListId, data);
  res.status(httpStatus.OK).json(shoppingList);
});

groupShoppingListRouter.delete('/:id', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { groupId } = req.body;
  const shoppingListId = Number(req.params.id);
  await deleteGroupShoppingList(shoppingListId, groupId, userId);
  res.status(httpStatus.OK).json();
});

export default groupShoppingListRouter;
