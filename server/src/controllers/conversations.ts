import { Response } from 'express';
import { AuthenticatedRequest } from '@/lib/types';
import { createMsg, createNewConversation, findConversation, isTruthy } from '@/lib/utils';

export type QueryFilter = {
  memberOneId: string;
  memberTwoId: string;
};

export type QueryOption = {
  createIfNotExist: string;
};

export const getConversation = async (
  req: AuthenticatedRequest<any, any, QueryFilter & Partial<QueryOption>>,
  res: Response,
) => {
  const { memberOneId, memberTwoId, createIfNotExist } = req.query;
  if (!memberOneId || !memberTwoId) {
    return res.status(400).json(
      createMsg({
        type: 'invalid',
        invalidMessage: 'Require member one id and member two id',
      }),
    );
  }

  const [foundConversation1, foundConversation2] = await Promise.all([
    findConversation(memberOneId, memberTwoId),
    findConversation(memberTwoId, memberOneId),
  ]);
  let conversation = foundConversation1 || foundConversation2;
  if (conversation) {
    return res.status(200).json(conversation);
  }

  if (!isTruthy(createIfNotExist)) {
    return res.status(400).json(
      createMsg({
        type: 'invalid',
        invalidMessage: 'Conversation not exist',
      }),
    );
  }

  const newConversation = await createNewConversation(memberOneId, memberTwoId);
  if (!newConversation) {
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
  return res.status(200).json(newConversation);
};

export const createConversation = async (
  req: AuthenticatedRequest<any, any, QueryFilter>,
  res: Response,
) => {
  const { memberOneId, memberTwoId } = req.query;
  if (!memberOneId || !memberTwoId) {
    return res.status(400).json(
      createMsg({
        type: 'invalid',
        invalidMessage: 'Require member one id and member two id',
      }),
    );
  }

  const [foundConversation1, foundConversation2] = await Promise.all([
    findConversation(memberOneId, memberTwoId),
    findConversation(memberTwoId, memberOneId),
  ]);
  let duplicateConversation = foundConversation1 || foundConversation2;
  if (duplicateConversation) {
    return res.status(400).json(
      createMsg({
        type: 'invalid',
        invalidMessage: 'Conversation already exist',
      }),
    );
  }

  const newConversation = await createNewConversation(memberOneId, memberTwoId);
  if (!newConversation) {
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
  return res.status(200).json(newConversation);
};
