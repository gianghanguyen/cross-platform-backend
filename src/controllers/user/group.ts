import { Response, Router } from 'express';
import { tokenExtractor, CustomRequest } from '~/middlewares/auth';
import { createGroup, groupInfo, updateGroup, getGroups, addMembers, removeMembers } from '~/services/user/group';
import { groupValidation } from '~/validations/group';
import upload from '~/middlewares/multer';
import httpStatus from 'http-status-codes';
import { v2 as cloudinary } from 'cloudinary';
import 'express-async-errors';

const groupRouter = Router();
groupRouter.use(tokenExtractor('USER'));

groupRouter.get('/:id', async (req: CustomRequest, res: Response) => {
  const user = req.user;
  const groupId = req.params.id;
  const group = await groupInfo(Number(groupId), Number(user.id));
  res.status(httpStatus.OK).send(group);
});

groupRouter.get('/', async (req: CustomRequest, res: Response) => {
  const groups = await getGroups(req.user.id);
  res.status(httpStatus.OK).json(groups);
});

groupRouter.post('/', groupValidation.create, async (req: CustomRequest, res: Response) => {
  const user = req.user;
  const data = req.body;
  const group = await createGroup(data, Number(user.id));
  res.status(httpStatus.CREATED).json(group);
});

groupRouter.patch('/:id', groupValidation.update, upload.single('image'), async (req: CustomRequest, res: Response) => {
  const user = req.user;
  const groupId = req.params.id;
  let photoUrl = null;
  if (req.file) {
    photoUrl = (await cloudinary.uploader.upload(req.file!.path, { resource_type: 'image' })).secure_url;
  }

  const data = photoUrl ? { ...req.body, photoUrl } : req.body;
  const group = await updateGroup(Number(groupId), user.id, data);
  res.status(httpStatus.OK).json(group);
});

groupRouter.patch(
  '/:groupId/add-member',
  groupValidation.addMembersSchema,
  async (req: CustomRequest, res: Response) => {
    const user = req.user;
    const { groupId } = req.params;
    const updatedGroup = await addMembers(Number(user.id), Number(groupId), req.body.emails);
    res.status(httpStatus.OK).json(updatedGroup);
  },
);

groupRouter.patch(
  '/:groupId/remove-member',
  groupValidation.removeMembersSchema,
  async (req: CustomRequest, res: Response) => {
    const user = req.user;
    const { groupId } = req.params;
    const updatedGroup = await removeMembers(Number(user.id), Number(groupId), req.body.userIds);
    res.status(httpStatus.OK).json(updatedGroup);
  },
);

export default groupRouter;
