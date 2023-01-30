import { Request, Response } from 'express';
import { logger } from '@/libs';
import { ApiErrors, ApiResponse, successMessage } from '@/response_builder';
import DbSyncUpService from './dbSyncUp.service';

export default class DbSyncUpController {
  public static async updateDb(_req: Request, res: Response) {
    const payload: { ids: Array<string>; type: string } = _req.body;
    logger.info('# Api payload data', JSON.stringify(payload, null, 2));

    // * Get plant/device data from Atlas DB
    const productionData: any = await DbSyncUpService.getProuctionData(payload);

    if (productionData.error) {
      ApiErrors.sendError(res, productionData.error);
      return;
    }

    // * Update retrived plant/device data to Isolated DB
    const updatedIsolatedDBData: any = await DbSyncUpService.updateIsolatedDB(
      _req.body,
      productionData.result
    );

    const response = ApiResponse.newResponse({
      data: updatedIsolatedDBData,
      message: successMessage.dbSyncUp.SYNC_UP_SUCCESS,
      status: 200,
    });

    res.status(response.status);
    res.json(response);
  }
}
