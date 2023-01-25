import { Request, Response } from 'express';
import { logger } from '@/libs';
import DbSyncUpService from './dbSyncUp.service';

export default class DbSyncUpController {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static async updateDb(_req: Request, res: Response) {
    // eslint-disable-next-line no-console

    const updateDbResp: any = await DbSyncUpService.updateDB(_req.body);

    logger.info('updating db');
    res.json(updateDbResp);
  }
}
