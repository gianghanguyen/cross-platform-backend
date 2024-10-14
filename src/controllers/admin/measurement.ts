import { Request, Response, Router } from 'express';
import 'express-async-errors';
import { tokenExtractor } from '~/middlewares/auth';
import {
  createUnitOfMeasure,
  deleteUnitOfMeasure,
  getAllUnitOfMeasure,
  updateUnitOfMeasure,
} from '~/services/admin/measurement';

const adminUnitOfMeasureRouter = Router();
adminUnitOfMeasureRouter.use(tokenExtractor('ADMIN'));

adminUnitOfMeasureRouter.post('/', async (req: Request, res: Response) => {
  res.json(await createUnitOfMeasure(req.body));
});

adminUnitOfMeasureRouter.get('/', async (req: Request, res: Response) => {
  res.json(await getAllUnitOfMeasure());
});

adminUnitOfMeasureRouter.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  res.json(await deleteUnitOfMeasure({ id: parseInt(id) }));
});

adminUnitOfMeasureRouter.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  res.json(await updateUnitOfMeasure({ id: parseInt(id) }, req.body));
});

export default adminUnitOfMeasureRouter;
