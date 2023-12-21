import { Request } from 'express';

export type AccessTokenPayload = {
  profileId: string;
};

export type AuthenticatedRequest<Params = any, Body = any, Query = any> = Request<
  Params,
  any,
  Body,
  Query
> & {
  user?: AccessTokenPayload;
};
