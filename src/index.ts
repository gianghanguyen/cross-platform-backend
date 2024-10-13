import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorConverter, errorHandler } from './middlewares/error-handler';
import connectCloudinary from './utils/cloudinary';

import userAuthRouter from './controllers/user/auth';
import adminAuthRouter from './controllers/admin/auth';
import adminUserRouter from './controllers/admin/user';
import profileRouter from './controllers/profile';
import categoryRouter from './controllers/admin/category';
import measurementRouter from './controllers/admin/measurement';
import foodRouter from './controllers/food';



const app = express();
const port = process.env.PORT || 5000;
connectCloudinary();

app.use(cors());
app.options('*', cors());

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/healthcheck', (req, res) => {
  res.json({ status: 'ok' });
});

// user routers
app.use('/user/auth', userAuthRouter);

// admin routers
app.use('/admin/auth', adminAuthRouter);
app.use('/admin/user', adminUserRouter);
app.use('/admin/category', categoryRouter);
app.use('/admin/measurement', measurementRouter);

// profile router
app.use('/profile', profileRouter);

// food router
app.use('/food', foodRouter);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
