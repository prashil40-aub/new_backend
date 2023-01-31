/* eslint-disable array-callback-return */
/* eslint-disable guard-for-in */
/* eslint-disable no-plusplus */
import moment from 'moment';
import { IResultAndError } from '@/interfaces';
import { logger } from '@/libs';
import { IPowerplant } from '@/models';
import { ApiErrors } from '@/response_builder';
import { IDeviceMac } from 'app/db/models/deviceMac/deviceMac.interface';
import DeviceMacService from '../deviceMac/deviceMac.service';

class BillingService {
  public static getPlantsBillingDetails = async (
    data: any,
    plantDetails: IPowerplant | any
  ): Promise<IResultAndError<IDeviceMac | any | null>> => {
    try {
      // * fromDate
      data.startDate = new Date(data.startDate);

      data.fromSt = moment(data.startDate).startOf('day').add(5, 'hours').add(30, 'minutes');
      // logger.info('start Date-->', moment(data.startDate));
      data.fromSt = moment(data.fromSt).format('x');

      data.fromEnd = moment(data.startDate).endOf('day').add(5, 'hours').add(30, 'minutes');
      data.fromEnd = moment(data.fromEnd).format('x');

      // * toDate
      data.endDate = new Date(data.endDate);

      data.toSt = moment(data.endDate).startOf('day').add(5, 'hours').add(30, 'minutes');
      // logger.info('end Date-->', moment(data.endDate));
      data.toSt = moment(data.toSt).format('x');

      data.toEnd = moment(data.endDate).endOf('day').add(5, 'hours').add(30, 'minutes');
      data.toEnd = moment(data.toEnd).format('x');
      // logger.info('end Date data after -->', JSON.stringify(data));

      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        plantDetails.map(async (plant: any) => {
          const devices = await DeviceMacService.getDeviceMac(plant);
          if (devices.error) {
            return {
              result: null,
              error: devices.error,
            };
          }

          plant.deviceMac = devices.result;
          return devices;
        })
      );

      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        plantDetails.map(async (plant) => {
          plant.meters = [];
          const response = await DeviceMacService.getRawData(plant, data);
          if (response.error) {
            return {
              result: null,
              error: response.error,
            };
          }
          return response;
        })
      );

      const compare = (a, b) => {
        return a.serial - b.serial;
      };

      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        plantDetails.map((plant) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          plant.meters.sort(compare);
          // logger.info('meters-->', JSON.stringify(plant.meters, null, 2));
          delete plant.deviceMac;
        })
      );

      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        plantDetails.map(async (plant) => {
          let positionCount = 1;
          await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            plant.meters.map((meter) => {
              meter.position = positionCount;
              positionCount++;
            })
          );
        })
      );

      return {
        result: plantDetails,
        error: null,
      };
    } catch (error) {
      logger.err(
        '# Error while fetching plant billing Details BillingService.getPlantsBillingDetails()',
        error
      );
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  };
}

export default BillingService;
