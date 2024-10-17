import { Request, Response, Router } from 'express';
import 'express-async-errors';
import { tokenExtractor } from '~/middlewares/auth';
import { createCategory, deleteCategory, getAllCategory, updateCategory } from '~/services/admin/category';

const adminCategoryRouter = Router();
adminCategoryRouter.use(tokenExtractor('ADMIN'));

adminCategoryRouter.post('/', async (req: Request, res: Response) => {
  res.json(await createCategory(req.body));
});

adminCategoryRouter.get('/', async (req: Request, res: Response) => {
  res.json(await getAllCategory());
});

adminCategoryRouter.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  res.json(await deleteCategory({ id: parseInt(id) }));
});

adminCategoryRouter.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  res.json(await updateCategory({ id: parseInt(id) }, req.body));
});

export default adminCategoryRouter;
