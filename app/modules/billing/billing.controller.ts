import { Request, Response } from 'express';
import { logger } from '@/libs';
import { ApiErrors, ApiResponse, successMessage } from '@/response_builder';
import { IPowerPlantModel } from 'app/db/models/powerPlant/powerplant.model';
import PowerPlantService from '../powerPlant/powerplant.service';
import BillingService from './billing.service';

class BillingController {
  public static async getReadings(_req: Request, res: Response) {
    try {
      const plantData: IPowerPlantModel | any = _req.query;
      logger.info('# Api query data', plantData.powerPlantIds);

      //   const criteria: any = {
      //     isDeleted: false,
      //   };

      // if (plantData.powerPlantIds) {
      //     criteria._id = { $in: plantData.powerPlantIds.split(',') };
      // }

      const plantDetails = await PowerPlantService.getPlantDetails(plantData);
      if (plantDetails.error) {
        ApiErrors.sendError(res, plantDetails.error);
        return;
      }
      // logger.info('plantDetails==>', plantDetails.result[0].plantName);

      const plantsBillingData = await BillingService.getPlantsBillingDetails(
        plantData,
        plantDetails.result
      );

      const response = ApiResponse.newResponse({
        data: plantsBillingData,
        message: successMessage.powerPlant.PLANT_DETAILS_FOUND,
        status: 200,
      });

      res.status(response.status);
      res.json(response);
    } catch (error) {
      logger.err(
        '# Error while getting power plant readings in BillingController.geReadings()',
        error
      );
      const er = ApiErrors.newInternalServerError('Something went wrong');
      ApiErrors.sendError(res, er);
    }
  }
}

export default BillingController;
