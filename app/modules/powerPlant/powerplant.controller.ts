import { Request, Response } from 'express';
import { logger } from '@/libs';
// import { IPowerplant } from '@/models';
import { ApiErrors, ApiResponse, successMessage } from '@/response_builder';
// import DeviceService from '../device/device.service';
import { IPowerplant } from 'app/db/models/powerPlant/powerplant.interface';
import PowerPlantService from './powerplant.service';

class PowerPlantController {
  public static async getPlantDetails(_req: Request, res: Response) {
    try {
      const plantData: IPowerplant = _req.query;
      // plantData: { powerPlantId: 9832bd83j2832 }

      const plantDetails: any = await PowerPlantService.getPlantDetails(plantData);
      if (plantDetails.error) {
        ApiErrors.billingApiErrorResponse(res, plantDetails.error);
        return;
      }
      // logger.info('plantDetails==>>', plantDetails.result);
      // powerPlantdetails will be plantDetails.result
      //   const plantDeviceDetails = await DeviceService.getAllDevices(plantDetails.result);
      //   if (plantDeviceDetails.error) {
      //     ApiErrors.sendError(res, plantDeviceDetails.error);
      //     return;
      //   }
      //   plantDetails.result.deviceMac = plantDeviceDetails.result;
      // plantDetails.devices = plantDeviceDetails;
      // plantDeviceDetails will be plantDeviceDetails.

      //   const plantDateArray = PowerPlantService.getPlantDateArray(plantData);
      //   if (plantDateArray.error) {
      //     ApiErrors.sendError(res, plantDateArray.error);
      //     return;
      //   }

      //   const plantDeviceData = await DeviceService.plantDeviceData(
      //     plantDetails.result,
      //     plantDateArray.result[0]
      //   );
      //   if (plantDeviceData.error) {
      //     ApiErrors.sendError(res, plantDeviceData.error);
      //     return;
      //   }

      const response = ApiResponse.billingApiResponse({
        data: plantDetails,
        message: successMessage.powerPlant.PLANT_DETAILS_FOUND,
        status: 200,
      });

      res.status(response.statusCode);
      res.json(response);
    } catch (error) {
      logger.err(
        '# Error while fetching Plant details in PowerPlantController.getPlantDetails()',
        error
      );
      const er = ApiErrors.newInternalServerError('Something went wrong');
      ApiErrors.billingApiErrorResponse(res, er);
    }
  }
}

export default PowerPlantController;
