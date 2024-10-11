import express, { Request, Response } from 'express';
import authRouter from './controllers/user/auth';
import helmet from 'helmet';
import cors from 'cors';
import { errorConverter, errorHandler } from './middlewares/error-handler';
import adminAuthRouter from './controllers/admin/auth';
import adminUserRouter from './controllers/admin/user';
import groupRouter from './controllers/user/group';
import presignedUrlRouter from './controllers/common/presignedUrl';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.options('*', cors());

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/healthcheck', (req: Request, res: Response) => {
  res.status(200).json({ message: 'OK' });
});

// user routers
app.use('/auth', authRouter);
app.use('/group', groupRouter);

// admin routers
app.use('/admin/auth', adminAuthRouter);
app.use('/admin/user', adminUserRouter);

// common
app.use('/presigned-url', presignedUrlRouter);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
