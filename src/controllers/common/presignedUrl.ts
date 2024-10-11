import { Router, Request, Response } from 'express';
import { presignedUploadUrl } from '~/services/common/presignedUrl';
import httpStatus from 'http-status';
import { tokenExtractor } from '~/middlewares/auth';

const presignedUrlRouter = Router();
presignedUrlRouter.use(tokenExtractor('USER') || tokenExtractor('ADMIN'));

presignedUrlRouter.get('/', async (req: Request, res: Response) => {
  const fileName = req.query.fileName as string;
  res.status(httpStatus.OK).json(await presignedUploadUrl(fileName));
});

export default presignedUrlRouter;
