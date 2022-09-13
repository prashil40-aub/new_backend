import { Request, Response } from 'express';
import { logger } from '@/libs';
import { IZone } from '@/models';
import { ApiErrors, ApiResponse, successMessage } from '@/response_builder';
import ZoneService from './zone.service';

class ZoneController {
  public static async createZone(req: Request, res: Response) {
    try {
      const zoneData: IZone = req.body;

      const zoneRes = await ZoneService.createZone(zoneData);
      if (zoneRes.error) {
        ApiErrors.sendError(res, zoneRes.error);
        return;
      }

      const response = ApiResponse.newResponse({
        data: zoneRes,
        message: successMessage.zone.ZONE_CREATED,
      });

      res.status(response.status);
      res.json(response);
    } catch (error) {
      logger.err('# Error while getting user by id in ZoneCotnroller.createZone()', error);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      ApiErrors.sendError(res, er);
    }
  }
}

export default ZoneController;
