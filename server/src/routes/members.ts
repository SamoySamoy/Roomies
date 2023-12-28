import { Router } from 'express';

import {
  // createMember,
  // getMemberByMemberId,
  updateMember,
  deleteMember,
  getMembers,
} from '@/controllers/members';
const members = Router();

members.get('/', getMembers);

// members.get('/:memberId', getMemberByMemberId);
// members.post('/', createMember);

members.put('/:memberId', updateMember);
members.delete('/:memberId', deleteMember);

export default members;
