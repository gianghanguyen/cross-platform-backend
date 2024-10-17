import { Router } from 'express';
import { tokenExtractor } from '~/middlewares/auth';
import {
  createMealPlan,
  deleteMealPlan,
  findMealPlanById,
  findMealPlans,
  updateMealPlan,
} from '~/services/user/mealPlan';
import httpStatus from 'http-status';
import { mealPlanValidation } from '~/validations/mealPlan';

const mealPlanRouter = Router();
mealPlanRouter.use(tokenExtractor('USER'));

mealPlanRouter.get('/', mealPlanValidation.query, async (req, res) => {
  const query = req.query;
  const userId = req.user.id;
  const mealPlan = await findMealPlans(userId, query.day as unknown as Date);
  res.status(httpStatus.OK).json(mealPlan);
});

mealPlanRouter.get('/:id', async (req, res) => {
  const mealPlan = await findMealPlanById(req.user.id, Number(req.params.id));
  res.status(httpStatus.OK).json(mealPlan);
});

mealPlanRouter.post('/', mealPlanValidation.create, async (req, res) => {
  const userId = req.user.id;
  const data = req.body;
  const mealPlan = await createMealPlan({ ...data, creatorId: userId });
  res.status(httpStatus.CREATED).json(mealPlan);
});

mealPlanRouter.patch('/:id', mealPlanValidation.update, async (req, res) => {
  const userId = req.user.id;
  const mealPlanId = Number(req.params.id);
  const data = req.body;
  const mealPlan = await updateMealPlan(userId, mealPlanId, data);
  res.status(httpStatus.OK).json(mealPlan);
});

mealPlanRouter.delete('/:id', async (req, res) => {
  const userId = req.user.id;
  const mealPlanId = Number(req.params.id);
  await deleteMealPlan(userId, mealPlanId);
  res.status(httpStatus.NO_CONTENT).json();
});

export default mealPlanRouter;
