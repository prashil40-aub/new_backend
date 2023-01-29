import { Request, Response } from 'express';
import { logger } from '@/libs';
import DbSyncUpService from './dbSyncUp.service';

export default class DbSyncUpController {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static async updateDb(_req: Request, res: Response) {
    // eslint-disable-next-line no-console
    // logger.info('Body ====> ', _req.body);
    logger.info(' _req.body===>', JSON.stringify(_req.body, null, 2));
    // * Get plant/device data from Atlas DB
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const productionData: any = await DbSyncUpService.getProuctionData(_req.body);

    // * Update retrived plant/device data to Isolated DB
    const updatedIsolatedDBData: any = await DbSyncUpService.updateIsolatedDB(
      _req.body,
      productionData.result
    );

    // const updateDbResp: any = await DbSyncUpService.updateDB(_req.body);

    logger.info('updating db');
    res.json(updatedIsolatedDBData);
  }
}
