import { Response, Router } from 'express';
import { tokenExtractor, CustomRequest } from '~/middlewares/auth';
import {
  createUserShoppingList,
  getAllUserShoppingList,
  getUserShoppingListInfo,
  updateUserShoppingList,
  deleteUserShoppingList,
} from '~/services/user/shopping-list';
import 'express-async-errors';
import httpStatus from 'http-status-codes';

const userShoppingListRouter = Router();
userShoppingListRouter.use(tokenExtractor('USER'));

userShoppingListRouter.post('/', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const shoppingList = await createUserShoppingList(req.body, userId);
  res.status(httpStatus.CREATED).json(shoppingList);
});

userShoppingListRouter.get('/', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const shoppingLists = await getAllUserShoppingList(userId);
  res.status(httpStatus.OK).json(shoppingLists);
});

userShoppingListRouter.get('/:id', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const shoppingListId = Number(req.params.id);
  const shoppingList = await getUserShoppingListInfo(shoppingListId, userId);
  res.status(httpStatus.OK).json(shoppingList);
});

userShoppingListRouter.put('/:id', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const shoppingListId = Number(req.params.id);
  const shoppingList = await updateUserShoppingList(shoppingListId, userId, req.body);
  res.status(httpStatus.OK).json(shoppingList);
});

userShoppingListRouter.delete('/:id', async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const shoppingListId = Number(req.params.id);
  await deleteUserShoppingList(shoppingListId, userId);
  res.status(httpStatus.OK).json();
});

export default userShoppingListRouter;
