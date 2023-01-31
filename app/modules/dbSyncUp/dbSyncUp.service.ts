/* eslint-disable func-names */
import { IDeviceMac, IDeviceMacData, IPowerPlantData } from '@/db';
import { IResultAndError } from '@/interfaces';
import { logger } from '@/libs';
import { ProdDeviceMac, DeviceMac, PowerPlant, ProdPowerPlant } from '@/models';
import { ApiErrors } from '@/response_builder';
// import DeviceMac from 'app/db/models/deviceMac/deviceMac.model';
import { Query } from 'app/utils/query';

export default class DbSyncUpService {
  // eslint-disable-next-line @typescript-eslint/require-await, consistent-return
  // public static updateDB = (payload: { type: string; id: string }): Promise<any> => {
  //   // eslint-disable-next-line @typescript-eslint/require-await, no-async-promise-executor
  //   return new Promise<any>((resolve, reject) => {
  //     try {
  //       if (payload.type === 'powerplants') {
  //         const collection = productionDB.collection('powerplants');
  //         // eslint-disable-next-line func-names
  //         collection.findOne(
  //           { _id: new mongoose.Types.ObjectId(payload.id) },
  //           async function (_err: any, result: any) {
  //             if (_err) {
  //               // eslint-disable-next-line prefer-promise-reject-errors
  //               reject({ error: _err });
  //             }
  //             await Query.permanentDelete(PowerPlant, {
  //               _id: new mongoose.Types.ObjectId(result._id),
  //             });
  //             const powerPlant = await Query.save(PowerPlant, result);
  //             resolve({ data: powerPlant });
  //           }
  //         );
  //       } else if (payload.type === 'devicemacs') {
  //         logger.info('devicemacs');
  //         const collection = productionDB.collection('devicemacs');
  //         collection
  //           .find({ powerPlantId: new mongoose.Types.ObjectId(payload.id) })
  //           .toArray(async function (_err: any, result: any) {
  //             if (_err) {
  //               // eslint-disable-next-line prefer-promise-reject-errors
  //               reject({ error: _err });
  //             }
  //             await Query.permanentDelete(DeviceMac, {
  //               powerPlantId: new mongoose.Types.ObjectId(payload.id),
  //             });
  //             const powerPlant = await Query.bulkSave(DeviceMac, result);
  //             resolve({ data: powerPlant });
  //           });
  //       } else {
  //         logger.info('other');
  //       }
  //       // eslint-disable-next-line no-unreachable
  //     } catch (error) {
  //       logger.err('# Error while sync the DB', error);
  //       // eslint-disable-next-line prefer-promise-reject-errors
  //       reject({ error });
  //     }
  //   });
  // };

  public static getProuctionDataById = async (payload: {
    ids: Array<string>;
    type: string;
  }): Promise<IResultAndError<Array<IPowerPlantData | IDeviceMacData> | any | null>> => {
    try {
      let data: any = [];

      const criteria = {
        _id: {
          $in: payload.ids,
        },
      };

      const options = {
        lean: true,
      };

      if (payload.type === 'powerplant') {
        const projection = {
          plantName: 1,
          state: 1,
          district: 1,
          city: 1,
          plantCapacity: 1,
          isDeleted: 1,
          isHide: 1,
        };

        // * Get plants from production database with $in query
        data = await Query.find(ProdPowerPlant, criteria, projection, options);
        if (!data.length) {
          return {
            result: null,
            error: ApiErrors.newNotFoundError('No PowerPlant found in Production DB'),
          };
        }
      } else if (payload.type === 'device') {
        const projection = {
          deviceId: 1,
          serial: 1,
          macAddress: 1,
          powerPlantId: 1,
          deviceName: 1,
          meters: 1,
          inverters: 1,
          useForEnergyCalculation: 1,
          isDeleted: 1,
        };

        // * Get devices from production database with $in query
        data = await Query.find(ProdDeviceMac, criteria, projection, options);

        if (!data.length) {
          return {
            result: null,
            error: ApiErrors.newNotFoundError('No Device found in Production DB'),
          };
        }
      }

      return {
        result: data,
        error: null,
      };
    } catch (error) {
      logger.err(
        '# Error while fetching Data from production DbSyncUpService.getProuctionData()',
        error
      );
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  };

  public static updateIsolatedDB = async (
    payload: {
      ids: Array<string>;
      type: string;
    },
    data: Array<any>
  ): Promise<IResultAndError<string | any | null>> => {
    try {
      let count = 0;
      if (payload.type === 'powerplant') {
        await Promise.all(
          data.map(async (plant: IPowerPlantData) => {
            const id = plant._id;
            delete plant._id;
            await Query.updateOne(PowerPlant, { _id: id }, plant, { upsert: true });
            count += 1;
          })
        );
      } else if (payload.type === 'device') {
        await Promise.all(
          data.map(async (device: IDeviceMacData) => {
            const id = device._id;
            delete device._id;
            await Query.updateOne(DeviceMac, { _id: id }, device, { upsert: true });
            count += 1;
          })
        );
      }
      return {
        result: `Updated ${count} ${payload.type}${count > 1 ? 's' : ''}`,
        error: null,
      };
    } catch (error) {
      logger.err(
        '# Error while fetching Data from production DbSyncUpService.updateIsolatedDB()',
        error
      );
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  };

  public static getProductionData = async (): Promise<
    IResultAndError<
      { powerplants: Array<IPowerPlantData>; deviceMacs: Array<IDeviceMac> } | any | null
    >
  > => {
    try {
      const criteria = {
        isDeleted: false,
      };

      const options = {
        lean: true,
      };

      const powerplantProjection = {
        plantName: 1,
        state: 1,
        district: 1,
        city: 1,
        plantCapacity: 1,
        isDeleted: 1,
        isHide: 1,
      };

      const deviceMacProjection = {
        deviceId: 1,
        serial: 1,
        macAddress: 1,
        powerPlantId: 1,
        deviceName: 1,
        meters: 1,
        inverters: 1,
        useForEnergyCalculation: 1,
        isDeleted: 1,
      };

      const data: {
        powerplants: Array<IPowerPlantData> | any;
        deviceMacs: Array<IDeviceMac> | any;
      } = {
        powerplants: [],
        deviceMacs: [],
      };

      data.powerplants = await Query.find(ProdPowerPlant, criteria, powerplantProjection, options);
      if (!data.powerplants?.length) {
        return {
          result: null,
          error: ApiErrors.newNotFoundError('No Powerplant found in Production DB'),
        };
      }

      data.deviceMacs = await Query.find(ProdDeviceMac, criteria, deviceMacProjection, options);
      if (!data.deviceMacs?.length) {
        return {
          result: null,
          error: ApiErrors.newNotFoundError('No Device found in Production DB'),
        };
      }
      logger.info('powerplants===>', JSON.stringify(data.powerplants.length, null, 2));
      logger.info('deviceMacs===>', JSON.stringify(data.deviceMacs.length, null, 2));
      return {
        result: data,
        error: null,
      };
    } catch (error) {
      logger.err(
        '# Error while fetching Data from production DbSyncUpService.getProductionData()',
        error
      );
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  };

  public static updateIsolatedDBInBulk = async (
    productionData:
      | {
          powerplants: Array<IPowerPlantData>;
          deviceMacs: Array<IDeviceMac>;
        }
      | any
  ): Promise<IResultAndError<any>> => {
    try {
      // logger.info('Data===>', JSON.stringify(, null, 2));
      logger.info('powerplants===>', JSON.stringify(productionData.powerplants.length, null, 2));
      logger.info('deviceMacs===>', JSON.stringify(productionData.deviceMacs.length, null, 2));
      let powerplantsCount = 0;
      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        productionData.powerplants.map(async (plant: IPowerPlantData) => {
          const id = plant._id;
          delete plant._id;
          await Query.updateOne(PowerPlant, { _id: id }, plant, { upsert: true });
          powerplantsCount += 1;
        })
      );
      let deviceMacsCount = 0;
      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        productionData.deviceMacs.map(async (device: IDeviceMacData) => {
          const id = device._id;
          delete device._id;
          await Query.updateOne(DeviceMac, { _id: id }, device, { upsert: true });
          deviceMacsCount += 1;
        })
      );
      return {
        result: `Updated ${powerplantsCount} Powerplants & ${deviceMacsCount} Devices`,
        error: null,
      };
    } catch (error) {
      logger.err(
        '# Error while updating bulk data in database DbSyncUpService.updateIsolatedDBInBulk()',
        error
      );
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  };
}
