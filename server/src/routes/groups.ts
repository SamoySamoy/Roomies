import { Router } from 'express';

import {
  createGroup,
  getGroupByGroupId,
  updateGroup,
  deleteGroup,
  getGroups,
} from '@/controllers/groups';
const groupsRouter = Router();

groupsRouter.get('/', getGroups);
groupsRouter.get('/:groupId', getGroupByGroupId);

groupsRouter.post('/', createGroup);

groupsRouter.put('/:groupId', updateGroup);

groupsRouter.delete('/:groupId', deleteGroup);

export default groupsRouter;
