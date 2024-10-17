import { Router, Request, Response } from 'express';
import { tokenExtractor } from '~/middlewares/auth';
import {
  createFridgeItem,
  deleteFridgeItem,
  findFridgeItemById,
  findFridgeItems,
  updateFridgeItem,
} from '~/services/user/fridgeItem';
import httpStatus from 'http-status';
import { fridgeItemValidation } from '~/validations/fridgeItem';

const fridgeItemRouter = Router();
fridgeItemRouter.use(tokenExtractor('USER'));

fridgeItemRouter.get('/', fridgeItemValidation.query, async (req: Request, res: Response) => {
  const query = req.query;
  const args = {
    userId: Number(req.user.id),
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Number(query.limit) : 10,
  };
  const items = await findFridgeItems(args);
  res.status(httpStatus.OK).json(items);
});

fridgeItemRouter.get('/:id', async (req: Request, res: Response) => {
  const item = await findFridgeItemById(Number(req.params.id), Number(req.user.id));
  res.status(httpStatus.OK).json(item);
});

fridgeItemRouter.post('/', fridgeItemValidation.create, async (req: Request, res: Response) => {
  const data = req.body;
  data.userId = Number(req.user.id);
  const item = await createFridgeItem(data);
  res.status(httpStatus.CREATED).json(item);
});

fridgeItemRouter.patch('/:id', fridgeItemValidation.update, async (req: Request, res: Response) => {
  const data = req.body;
  const item = await updateFridgeItem(Number(req.params.id), Number(req.user.id), data);
  res.status(httpStatus.OK).json(item);
});

fridgeItemRouter.delete('/:id', async (req: Request, res: Response) => {
  await deleteFridgeItem(Number(req.params.id), Number(req.user.id));
  res.status(httpStatus.NO_CONTENT).json();
});

export default fridgeItemRouter;
