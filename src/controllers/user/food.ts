import { Response, Router } from 'express';
import 'express-async-errors';
import { CustomRequest, tokenExtractor } from '~/middlewares/auth';
import upload from '~/middlewares/multer';
import { createFood, getFood, updateFood, getAllFoodByUser, deleteFood } from '~/services/user/food';
import { v2 as cloudinary } from 'cloudinary';
import { getAllCategory } from '~/services/admin/category';
import { getAllUnitOfMeasure } from '~/services/admin/measurement';

const foodRouter = Router();
foodRouter.use(tokenExtractor('USER'));

foodRouter.post('/', upload.single('image'), async (req: CustomRequest, res: Response) => {
  const { name, category, unit } = req.body;
  const image = req.file;
  let imageURL = null;
  if (image) {
    imageURL = (await cloudinary.uploader.upload(image!.path, { resource_type: 'image' })).secure_url;
  }
  const data = {
    name: name,
    imageURL: imageURL,
    user: { connect: { id: req.user!.id } },
    category: { connect: { name: category } },
    unit: { connect: { name: unit } },
  };
  res.json(await createFood(data));
});

foodRouter.get('/', async (req: CustomRequest, res: Response) => {
  const userId = Number(req.user!.id);
  res.json(await getAllFoodByUser(userId));
});

foodRouter.get('/:id', async (req: CustomRequest, res: Response) => {
  res.json(await getFood({ id: Number(req.params.id) }));
});

foodRouter.patch('/:id', upload.single('image'), async (req: CustomRequest, res: Response) => {
  const { name, category, unit } = req.body;
  const image = req.file;
  const updateData: any = {};

  if (name) updateData.name = name;
  if (category) updateData.category = { connect: { name: category } };
  if (unit) updateData.unit = { connect: { name: unit } };
  if (image) {
    console.log('image', image);
    const imageURL = (await cloudinary.uploader.upload(image!.path, { resource_type: 'image' })).secure_url;
    updateData.imageURL = imageURL;
  }

  res.json(await updateFood({ id: Number(req.params.id) }, updateData));
});

foodRouter.delete('/:id', async (req: CustomRequest, res: Response) => {
  res.json(await deleteFood({ id: Number(req.params.id) }));
});

foodRouter.post('/category', async (req: CustomRequest, res: Response) => {
  res.json(await getAllCategory());
});

foodRouter.post('/unit', async (req: CustomRequest, res: Response) => {
  res.json(await getAllUnitOfMeasure());
});

export default foodRouter;
