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
      // logger.info('# Api query data', JSON.stringify(plantData));

      const plantDetails = await PowerPlantService.getPlantDetails(plantData);
      if (plantDetails.error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        ApiErrors.billingApiErrorResponse(res, plantDetails.error);
        return;
      }
      // logger.info('plantDetails==>', plantDetails.result[0].plantName);

      const plantsBillingData = await BillingService.getPlantsBillingDetails(
        plantData,
        plantDetails.result
      );

      if (plantsBillingData.error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        ApiErrors.billingApiErrorResponse(res, plantsBillingData.error);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const response = ApiResponse.billingApiResponse({
        data: plantsBillingData,
        message: successMessage.powerPlant.PLANT_DETAILS_FOUND,
        status: 200,
      });

      res.status(response.statusCode);
      res.json(response);
    } catch (error) {
      logger.err(
        '# Error while getting power plant readings in BillingController.geReadings()',
        error
      );
      const er = ApiErrors.newInternalServerError('Something went wrong');
      ApiErrors.billingApiErrorResponse(res, er);
    }
  }
}

export default BillingController;
