import { IResultAndError } from '@/interfaces';
import { logger } from '@/libs';
import { IZone, Zone } from '@/models';
import { ApiErrors } from '@/response_builder';
import { Query } from 'app/utils/query';

class ZoneService {
  // * Create Zone
  public static createZone = async (zoneData: IZone): Promise<IResultAndError<IZone | null>> => {
    try {
      logger.info('==> 1:: Creating Zone');
      logger.info('Zone===>', JSON.stringify(Zone, null, 2));
      // * query helper
      const zone = await Query.save(Zone, zoneData);

      // * Check if Zone created Successfully
      if (!zone._id) {
        logger.info('==> 2:: User Is Not Found');
        return {
          result: null,
          error: ApiErrors.newBadRequestError('User Not Found'),
        };
      }

      // * Return response
      logger.info('==> 2:: Zone created Succesfully');
      return { result: zone, error: null };
    } catch (error) {
      logger.err('# Error while creating zone  ZoneService.createZone()', error);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  };
}

export default ZoneService;
