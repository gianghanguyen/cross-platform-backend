import { Response, Router } from 'express';
import 'express-async-errors';
import { CustomRequest, tokenExtractor } from '~/middlewares/auth';
import upload from '~/middlewares/multer';
import { createProfile, getProfile, updateProfile } from '~/services/user/profile';
import { v2 as cloudinary } from 'cloudinary';

const profileRouter = Router();
profileRouter.use(tokenExtractor('USER'));

profileRouter.post('/', upload.single('avatar'), async (req: CustomRequest, res: Response) => {
  const avatar = req.file;
  const photoURL = (await cloudinary.uploader.upload(avatar!.path, { resource_type: 'image' })).secure_url;
  const data = { ...req.body, photoURL: photoURL, user: { connect: { id: req.user!.id } } };
  res.json(await createProfile(data));
});

profileRouter.get('/:id', async (req: CustomRequest, res: Response) => {
  res.json(await getProfile({ userId: req.user!.id }));
});

profileRouter.patch('/:id', upload.single('avatar'), async (req: CustomRequest, res: Response) => {
  const avatar = req.file;
  if (avatar) {
    const photoURL = (await cloudinary.uploader.upload(avatar!.path, { resource_type: 'image' })).secure_url;
    res.json(await updateProfile({ userId: req.user!.id }, { ...req.body, photoURL: photoURL }));
  }
  res.json(await updateProfile({ userId: req.user!.id }, req.body));
});

export default profileRouter;
