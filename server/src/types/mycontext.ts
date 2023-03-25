import { Request, Response } from "express";
import { Redis } from "ioredis";

import { ISession } from "../utils/sessondata";

export type MyContext = {
  req: Request & { session: ISession };
  redis: Redis;
  res: Response;
};
