import { Response, Router } from 'express';
import 'express-async-errors';
import { CustomRequest, tokenExtractor } from '~/middlewares/auth';
import upload from '~/middlewares/multer';
import { createProfile, getProfile, updateProfile } from '~/services/user/profile';
import { v2 as cloudinary } from 'cloudinary';
import httpStatus from 'http-status-codes';

const profileRouter = Router();
profileRouter.use(tokenExtractor('USER'));

profileRouter.post('/', upload.single('avatar'), async (req: CustomRequest, res: Response) => {
  const avatar = req.file;
  const photoURL = (await cloudinary.uploader.upload(avatar!.path, { resource_type: 'image' })).secure_url;
  const userId = req.user!.id;
  const profile = await createProfile(userId, photoURL, req.body);
  res.status(httpStatus.CREATED).json(profile);
});

profileRouter.get('/:id', async (req: CustomRequest, res: Response) => {
  const userId = req.user!.id;
  const profile = await getProfile(userId);
  res.status(httpStatus.OK).json(profile);
});

profileRouter.patch('/:id', upload.single('avatar'), async (req: CustomRequest, res: Response) => {
  const avatar = req.file;
  const photoURL = avatar
    ? (await cloudinary.uploader.upload(avatar!.path, { resource_type: 'image' })).secure_url
    : null;
  const userId = req.user!.id;
  const profile = await updateProfile(userId, photoURL, req.body);
  res.status(httpStatus.OK).json(profile);
});

export default profileRouter;
