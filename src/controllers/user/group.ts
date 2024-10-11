import { Response, Router, Request } from 'express';
import { tokenExtractor } from '~/middlewares/auth';
import { createGroup, manageMember, groupInfo, updateGroup, getGroups } from '~/services/user/group';
import { groupValidation } from '~/validations/group';
import httpStatus from 'http-status-codes';
import 'express-async-errors';

const groupRouter = Router();
groupRouter.use(tokenExtractor('USER'));

groupRouter.get('/:id', async (req: Request, res: Response) => {
  const user = req.user;
  const groupId = req.params.id;
  const group = await groupInfo(Number(groupId), Number(user.id));
  res.status(httpStatus.OK).send(group);
});

groupRouter.get('/', async (req: Request, res: Response) => {
  const groups = await getGroups(req.user.id);
  res.status(httpStatus.OK).json(groups);
});

groupRouter.post('/', groupValidation.create, async (req: Request, res: Response) => {
  const user = req.user;
  const data = req.body;
  const group = await createGroup(data, Number(user.id));
  res.status(httpStatus.CREATED).json(group);
});

groupRouter.patch('/:id', groupValidation.update, async (req: Request, res: Response) => {
  const user = req.user;
  const groupId = req.params.id;
  const data = req.body;
  const group = await updateGroup(Number(groupId), user.id, data);
  res.status(httpStatus.OK).json(group);
});

groupRouter.patch('/:groupId/user', groupValidation.manageMember, async (req: Request, res: Response) => {
  const user = req.user;
  const { groupId } = req.params;
  const userIds = req.body.userIds;
  const action = req.body.action;
  await manageMember(Number(groupId), userIds, Number(user.id), action);
  res.status(httpStatus.OK).json();
});

export default groupRouter;
