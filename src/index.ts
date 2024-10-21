import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorConverter, errorHandler } from './middlewares/error-handler';
import connectCloudinary from './utils/cloudinary';

import userAuthRouter from './controllers/user/auth';
import adminAuthRouter from './controllers/admin/auth';
import adminUserRouter from './controllers/admin/user';
import groupRouter from './controllers/user/group';
import profileRouter from './controllers/user/profile';
import categoryRouter from './controllers/admin/category';
import measurementRouter from './controllers/admin/measurement';
import foodRouter from './controllers/user/food';
import recipeRouter from './controllers/user/recipe';
import fridgeItemRouter from './controllers/user/fridgeItem';
import mealPlanRouter from './controllers/user/mealPlan';
import userShoppingListRouter from './controllers/user/shopping-list';
import groupShoppingListRouter from './controllers/user/group/shopping-list';
import taskRouter from './controllers/user/group/task';

const app = express();
const port = process.env.PORT || 5000;
connectCloudinary();

app.use(cors());
app.options('*', cors());

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/healthcheck', (req: Request, res: Response) => {
  res.status(200).json({ message: 'OK' });
});

// user routers
app.use('/user/auth', userAuthRouter);
app.use('/user/group', groupRouter);
app.use('/user/profile', profileRouter);
app.use('/user/food', foodRouter);
app.use('/user/shopping-list', userShoppingListRouter);
app.use('/group/shopping-list', groupShoppingListRouter);
app.use('/group/task', taskRouter);

// admin routers
app.use('/admin/auth', adminAuthRouter);
app.use('/admin/user', adminUserRouter);
app.use('/admin/category', categoryRouter);
app.use('/admin/measurement', measurementRouter);

// user routers
app.use('/user/auth', userAuthRouter);
app.use('/group', groupRouter);
app.use('/profile', profileRouter);
app.use('/food', foodRouter);
app.use('/recipe', recipeRouter);
app.use('/fridge-item', fridgeItemRouter);
app.use('/meal-plan', mealPlanRouter);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
