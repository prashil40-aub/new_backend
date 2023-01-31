// import moment from 'moment';
import { IResultAndError } from '@/interfaces';
import { logger } from '@/libs';
import { IPowerplant, PowerPlant } from '@/models';
import { ApiErrors } from '@/response_builder';
import { Query } from 'app/utils/query';

class PowerPlantService {
  // * Get Power Plant Details
  public static getPlantDetails = async (
    data: IPowerplant | any
  ): Promise<IResultAndError<IPowerplant | any | null>> => {
    try {
      logger.info('==> 1:: Fetching Power plant Details');

      const criteria: any = {
        // _id: powerPlantData.powerPlantId,
        isHide: false,
        isDeleted: false,
      };

      if (data.powerPlantIds) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        criteria._id = { $in: data.powerPlantIds.split(',') };
      }

      const projection = {
        plantCapacity: 1,
        state: 1,
        city: 1,
        district: 1,
        plantName: 1,
        plantCode: 1,
      };

      const options = {
        lean: true,
      };
      // * query helper
      // TODO: make getOne query in query helper and replave here.
      const powerPlant = await Query.find(PowerPlant, criteria, projection, options);

      // * Check if Power plant Details fetched successfully
      if (!powerPlant) {
        logger.info('==> 2:: No Plants Found');
        return {
          result: null,
          error: ApiErrors.newNotFoundError('No Plants Found'),
        };
      }

      // * Return Response
      // logger.info('==> 2:: Power Plant Details fetched Successfully');
      return { result: powerPlant, error: null };
    } catch (error) {
      logger.err(
        '# Error while fetching Power plant Details PowerPlantService.getPlantDetails()',
        error
      );
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  };
}

export default PowerPlantService;
