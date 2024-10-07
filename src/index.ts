import express from 'express';
import authRouter from './controllers/user/auth';
import helmet from 'helmet';
import cors from 'cors';
import { errorConverter, errorHandler } from './middlewares/error-handler';
import adminAuthRouter from './controllers/admin/auth';
import adminUserRouter from './controllers/admin/user';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.options('*', cors());

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/healthcheck', (req, res) => {
  res.json({ status: 'ok' });
});

// user routers
app.use('/auth', authRouter);

// admin routers
app.use('/admin/auth', adminAuthRouter);
app.use('/admin/user', adminUserRouter);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
