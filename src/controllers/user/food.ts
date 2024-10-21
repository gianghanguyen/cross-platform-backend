import { Response, Router } from 'express';
import 'express-async-errors';
import { CustomRequest, tokenExtractor } from '~/middlewares/auth';
import upload from '~/middlewares/multer';
import { createFood, getFood, updateFood, getAllFoodByUser, deleteFood } from '~/services/user/food';
import { v2 as cloudinary } from 'cloudinary';
import httpStatus from 'http-status-codes';

const foodRouter = Router();
foodRouter.use(tokenExtractor('USER'));

foodRouter.post('/', upload.single('image'), async (req: CustomRequest, res: Response) => {
  const userId = Number(req.user!.id);
  const { category, unit, ...data } = req.body;
  const imageURL = (await cloudinary.uploader.upload(req.file!.path, { resource_type: 'image' })).secure_url;
  const food = await createFood(userId, category, unit, imageURL, data);
  res.status(httpStatus.CREATED).json(food);
});

foodRouter.get('/', async (req: CustomRequest, res: Response) => {
  const userId = Number(req.user!.id);
  const foods = await getAllFoodByUser(userId);
  res.status(httpStatus.OK).json(foods);
});

foodRouter.get('/:id', async (req: CustomRequest, res: Response) => {
  const foodId = Number(req.params.id);
  const food = await getFood(foodId);
  res.status(httpStatus.OK).json(food);
});

foodRouter.patch('/:id', upload.single('image'), async (req: CustomRequest, res: Response) => {
  const foodId = Number(req.params.id);
  const { category, unit, ...data } = req.body;
  const imageURL = req.file
    ? (await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' })).secure_url
    : null;
  const food = await updateFood(foodId, category, unit, imageURL, data);
  res.status(httpStatus.OK).json(food);
});

foodRouter.delete('/:id', async (req: CustomRequest, res: Response) => {
  const foodId = Number(req.params.id);
  await deleteFood(foodId);
  res.status(httpStatus.OK).json();
});

export default foodRouter;
