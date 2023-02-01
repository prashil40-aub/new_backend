import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { logger } from '@/libs';
import { ApiErrors, ApiResponse, successMessage } from '@/response_builder';
import { apiErrorTypes } from 'app/response_builder/api_errors';
import PowerPlantService from '../powerPlant/powerplant.service';
import BillingService from './billing.service';

class BillingController {
  public static async getReadings(_req: Request, res: Response) {
    try {
      const payload: any = _req.query;
      logger.info('# Api query data', JSON.stringify(payload));

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const powerPlantIds = payload.powerPlantIds.split(',');

      let invalidPlantId: any;

      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        powerPlantIds.map((plantId) => {
          const isValidId = Types.ObjectId.isValid(plantId);

          if (!isValidId) {
            invalidPlantId = plantId;
          }
          return isValidId;
        })
      );

      if (invalidPlantId) {
        ApiErrors.billingApiErrorResponse(res, {
          status: 400,
          message: `DB Error: Invalid Id Provided: ${invalidPlantId}`,
          type: apiErrorTypes.INVALID_ID,
          success: false,
        });
        return;
      }

      const plantDetails = await PowerPlantService.getPlantDetails(payload);
      if (plantDetails.error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        ApiErrors.billingApiErrorResponse(res, plantDetails.error);
        return;
      }
      // logger.info('plantDetails==>', plantDetails.result[0].plantName);

      const plantsBillingData = await BillingService.getPlantsBillingDetails(
        payload,
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
      const er = ApiErrors.newInternalServerError(error as string);
      ApiErrors.billingApiErrorResponse(res, er);
    }
  }
}

export default BillingController;
