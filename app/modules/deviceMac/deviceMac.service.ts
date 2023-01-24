import { IPowerplant } from '@/db';
import { IResultAndError } from '@/interfaces';
import { logger } from '@/libs';
import { ApiErrors } from '@/response_builder';
import DeviceMac from 'app/db/models/deviceMac/deviceMac.model';
import { Query } from 'app/utils/query';

class DeviceMacService {
  public static getDeviceMac = async (
    data: IPowerplant | any
  ): Promise<IResultAndError<Array<object> | any | null>> => {
    try {
      // logger.info('details->', data._id);

      const criteria = {
        powerPlantId: data._id,
        macAddress: {
          $ne: '80-1F-12-0F-AD-16',
        },
        isDeleted: false,
      };

      const projection = {
        serial: 1,
        macAddress: 1,
        useForEnergyCalculation: 1,
        deviceId: 1,
        deviceName: 1,
      };

      const options = {
        lean: true,
        sort: {
          deviceId: 1,
        },
      };

      const deviceMac = await Query.find(DeviceMac, criteria, projection, options);

      if (!deviceMac) {
        logger.info('==> 2:: No deviceMacs found');
        return {
          result: null,
          error: ApiErrors.newNotFoundError('No deviceMac found'),
        };
      }

      // logger.info('deviceMacs found', deviceMac);

      logger.info('==> 2 :: deviceMacs fetched successfully!!');
      return {
        result: deviceMac,
        error: null,
      };
    } catch (error) {
      logger.err('# Error while fetching deviceMac details DeviceMacService.getDeviceMac()', error);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  };
}

export default DeviceMacService;
