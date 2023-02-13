/* eslint-disable guard-for-in */
/* eslint-disable no-plusplus */
import _ from 'lodash';
import { IPowerplant } from '@/db';
import { IResultAndError } from '@/interfaces';
import { logger } from '@/libs';
import { DeviceMac } from '@/models';
import { ApiErrors } from '@/response_builder';
import { Raw } from 'app/db/models/raw';
import { Query } from 'app/utils/query';

class DeviceMacService {
  public static getDeviceMac = async (
    data: IPowerplant | any
  ): Promise<IResultAndError<Array<object> | any | null>> => {
    try {
      logger.info('2:: fetching DeviceMac details');

      const criteria: any = {
        // powerPlantId: new mongoose.Types.ObjectId(data._id),
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

      // logger.info('deviceMacs found', deviceMac[0].macAddress);

      // logger.info('==> 2 :: deviceMacs fetched successfully!!');
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

  public static getRawData = async (
    plantData: any,
    payloadData: any
  ): Promise<IResultAndError<any | null>> => {
    try {
      let serialCount = 1;

      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        plantData.deviceMac.map(async (device) => {
          const serial = serialCount++;
          // logger.info('macAddress->', device.macAddress);
          const response = await this.getDeviceRawData(device, plantData, payloadData, serial);
          if (response.error) {
            return {
              result: null,
              error: response.error,
            };
          }
          return response;
        })
      );

      return {
        result: 'success',
        error: null,
      };
    } catch (error) {
      logger.err('# Error while fetching deviceMac details DeviceMacService.getRawData()', error);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  };

  public static getDeviceRawData = async (
    device: any,
    plantData: any,
    payloadData: any,
    serialCount: number
  ): Promise<IResultAndError<any | null>> => {
    try {
      logger.info('3:: fetching device Raw data');
      const fromDateCriteria = {
        mac: device.macAddress,
        timestamp: {
          $gte: _.toNumber(payloadData.fromSt),
          $lte: _.toNumber(payloadData.fromEnd),
        },
      };

      const toDateCriteria = {
        mac: device.macAddress,
        timestamp: {
          $gte: _.toNumber(payloadData.toSt),
          $lte: _.toNumber(payloadData.toEnd),
        },
      };

      let result1: any = await Query.find(Raw, fromDateCriteria, {}, { sort: { timestamp: -1 } });

      let result2: any = await Query.find(Raw, toDateCriteria, {}, { sort: { timestamp: -1 } });

      if (result1 && result1.length && result2 && result2.length) {
        let isInverter = 0;
        let idCount = 0;
        // eslint-disable-next-line eqeqeq
        if (device.useForEnergyCalculation == 'inverter') {
          isInverter = 1;
        }

        result1 = await this.getRecordWithData(result1, isInverter);
        result2 = await this.getRecordWithData(result2, isInverter);

        const finalObj2 = {};
        let length = (result1 && result1.meters && result1.meters.length) || 0;
        let invlength = (result1 && result1.inverters && result1.inverters.length) || 0;

        if (result2 && result2.meters.length > length) {
          length = result2.meters.length;
        }

        if (result2 && result2.inverters.length > invlength) {
          invlength = result2.inverters.length;
        }

        if (isInverter) {
          for (let i = 0; i < invlength; i++) {
            if (result1 && result1.inverters && result1.inverters[i]) {
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              const k1 = `${result1.mac}::${result1.inverters[i].id}`;

              finalObj2[k1] = {
                start: _.has(result1.inverters[i], 'kwh_total')
                  ? _.toNumber(result1.inverters[i].kwh_total)
                  : 0,
                end: _.has(result2.inverters[i], 'kwh_total')
                  ? _.toNumber(result2.inverters[i].kwh_total)
                  : 0,
                id: result1.inverters[i].id,
              };
            }
          }

          for (const key in finalObj2) {
            // logger.info('pushed-->', key.split('::')[0]);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            plantData.meters.push({
              macAddress: key.split('::')[0],
              id: idCount,
              start: finalObj2[key].start,
              end: finalObj2[key].end,
              deviceName: device.deviceName,
              serial: serialCount,
            });
            idCount++;
          }
          // eslint-disable-next-line eqeqeq
        } else if (device.useForEnergyCalculation == 'meter') {
          for (let i = 0; i < length; i++) {
            if (result1 && result1.meters && result1.meters[i]) {
              const k1 = `${result1.mac}:: meter${result1.meters[i].id}`;

              finalObj2[k1] = {
                start: _.has(result1.meters[i], 'meter_kwh_total')
                  ? _.toNumber(result1.meters[i].meter_kwh_total)
                  : 0,
                end: _.has(result2.meters[i], 'meter_kwh_total')
                  ? _.toNumber(result2.meters[i].meter_kwh_total)
                  : 0,
                id: result1.meters[i].id,
              };
            }
          }

          for (const key in finalObj2) {
            // logger.info('pushed-->', key.split('::')[0]);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            plantData.meters.push({
              macAddress: key.split(':: meter')[0],
              id: idCount,
              start: finalObj2[key].start,
              end: finalObj2[key].end,
              deviceName: device.deviceName,
              serial: serialCount,
            });
            idCount++;
          }
        }
        // logger.info('planData-->', JSON.stringify(plantData));
      } else {
        return {
          result: null,
          error: ApiErrors.newNotFoundError(`Raw data not found for ${device.macAddress}`),
        };
      }
      return {
        result: 'success',
        error: null,
      };
    } catch (error) {
      logger.err('# Error while fetching deviceMac details DeviceMacService.getRawData()', error);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  };

  public static getRecordWithData = (result, isInverter) => {
    return new Promise((resolve, reject) => {
      try {
        // logger.info('length of result-->', result.length);
        let resultData;
        if (isInverter) {
          // eslint-disable-next-line consistent-return
          _.each(result, (data) => {
            if (data.inverters.length) {
              let count = 0;
              const inverterCount = data.inverters ? data.inverters.length : 0;

              for (let i = 0; i < inverterCount; i++) {
                // eslint-disable-next-line eqeqeq
                if (_.has(data.inverters[i], 'id') && data.inverters[i].id != undefined) {
                  count++;
                }
              }

              //  * Check if all inverters has value for id field
              if (inverterCount === count) {
                resultData = data;
                return false;
              }
            }
          });
        } else {
          // eslint-disable-next-line consistent-return
          _.each(result, (data) => {
            if (data.meters.length) {
              let count = 0;
              const meterCount = data.meters ? data.meters.length : 0;

              for (let i = 0; i < meterCount; i++) {
                // eslint-disable-next-line eqeqeq
                if (_.has(data.meters[i], 'id') && data.meters[i].id != undefined) {
                  count++;
                }
              }

              if (meterCount === count) {
                resultData = data;
                return false;
              }
            }
          });
        }
        resolve(resultData);
      } catch (error) {
        logger.err('Something went wrong');
        reject(error);
      }
    });
  };
}

export default DeviceMacService;
