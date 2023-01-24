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
      data.fromSt = moment(data.fromSt).format('x');

      data.fromEnd = moment(data.startDate).endOf('day').add(5, 'hours').add(30, 'minutes');
      data.fromEnd = moment(data.fromEnd).format('x');

      // * toDate
      data.endDate = new Date(data.endDate);

      data.toSt = moment(data.endDate).startOf('day').add(5, 'hours').add(30, 'minutes');
      data.toSt = moment(data.toSt).format('x');

      data.toEnd = moment(data.endDate).endOf('day').add(5, 'hours').add(30, 'minutes');
      data.toEnd = moment(data.toEnd).format('x');

      // const plantDeviceMacs: Array<any> = [];
      // logger.info('plant data', plantDetails);

      // const plantDevices = await plantDetails.map(this.getDeviceMacs);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const plantDevices = await plantDetails.map(async (plant: any) => {
        // logger.info('plant ->', plant.plantName);
        const deviceMacs = await DeviceMacService.getDeviceMac(plant);
        // logger.info('deviceMacs ->', deviceMacs.result);
        return deviceMacs;
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      // plantDetails.forEach(async (plant: any) => {
      //   plant.meters = [];

      //   const deviceMacs = await DeviceMacService.getDeviceMac(plant);
      //   plantDeviceMacs.push(deviceMacs);

      // logger.info('device data', plantDevices);
      // });

      // if (plantDeviceMacs.length === 0) {
      //   logger.info('==> 2:: No deviceMacs found');
      //   return {
      //     result: null,
      //     error: ApiErrors.newNotFoundError('No deviceMacs found'),
      //   };
      // }

      return {
        result: plantDevices,
        error: null,
      };
      // return { result: data, error: null };
    } catch (error) {
      logger.err(
        '# Error while fetching plant billing Details BillingService.getPlantsBillingDetails()',
        error
      );
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  };

  public static getDeviceMacs = async (plant: any) => {
    logger.info('plant ->', plant.plantName);

    const deviceMacs = await DeviceMacService.getDeviceMac(plant);

    return deviceMacs;
  };
}

export default BillingService;
