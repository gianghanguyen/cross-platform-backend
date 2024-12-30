import { Router, Request, Response } from 'express';
import { tokenExtractor } from '~/middlewares/auth';
import { findRecipeById, findRecipes, deleteRecipe, createRecipe, updateRecipe } from '~/services/user/recipe';
import { recipeValidation } from '~/validations/recipe';
import upload from '~/middlewares/multer';
import httpStatus from 'http-status';
import { v2 as cloudinary } from 'cloudinary';

const recipeRouter = Router();
recipeRouter.use(tokenExtractor('USER'));

recipeRouter.get('/', recipeValidation.query, async (req: Request, res: Response) => {
  const userId = req.user.id;
  res.status(httpStatus.OK).json(await findRecipes(userId));
});

recipeRouter.get('/:id', async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json(await findRecipeById(Number(req.params.id)));
});

recipeRouter.post('/', upload.single('htmlContent'), async (req: Request, res: Response) => {
  const htmlContent = (await cloudinary.uploader.upload(req.file!.path, { resource_type: 'image' })).secure_url;
  console.log({ htmlContent, ...req.body });

  const newRecipe = await createRecipe({ ...req.body, htmlContent }, Number(req.user.id));
  res.status(httpStatus.CREATED).json(newRecipe);
});

recipeRouter.patch('/:id', async (req: Request, res: Response) => {
  const userId = Number(req.user.id);
  const recipeId = Number(req.params.id);
  res.status(httpStatus.OK).json(await updateRecipe(recipeId, userId, req.body));
});

recipeRouter.delete('/:id', async (req: Request, res: Response) => {
  const userId = Number(req.user.id);
  const recipeId = Number(req.params.id);
  await deleteRecipe(recipeId, userId);
  res.status(httpStatus.NO_CONTENT).json();
});

export default recipeRouter;
