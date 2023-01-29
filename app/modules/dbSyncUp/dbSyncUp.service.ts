/* eslint-disable func-names */
import mongoose from 'mongoose';
import { IPowerPlantData, productionDB } from '@/db';
import { IResultAndError } from '@/interfaces';
import { logger } from '@/libs';
import { DeviceMac, PowerPlant, ProdPowerPlant } from '@/models';
import { ApiErrors } from '@/response_builder';
// import DeviceMac from 'app/db/models/deviceMac/deviceMac.model';
import { Query } from 'app/utils/query';

export default class DbSyncUpService {
  // eslint-disable-next-line @typescript-eslint/require-await, consistent-return
  public static updateDB = (payload: { type: string; id: string }): Promise<any> => {
    // eslint-disable-next-line @typescript-eslint/require-await, no-async-promise-executor
    return new Promise<any>((resolve, reject) => {
      try {
        if (payload.type === 'powerplants') {
          const collection = productionDB.collection('powerplants');
          // eslint-disable-next-line func-names
          collection.findOne(
            { _id: new mongoose.Types.ObjectId(payload.id) },
            async function (_err: any, result: any) {
              if (_err) {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject({ error: _err });
              }
              await Query.permanentDelete(PowerPlant, {
                _id: new mongoose.Types.ObjectId(result._id),
              });
              const powerPlant = await Query.save(PowerPlant, result);
              resolve({ data: powerPlant });
            }
          );
        } else if (payload.type === 'devicemacs') {
          logger.info('devicemacs');
          const collection = productionDB.collection('devicemacs');
          collection
            .find({ powerPlantId: new mongoose.Types.ObjectId(payload.id) })
            .toArray(async function (_err: any, result: any) {
              if (_err) {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject({ error: _err });
              }
              await Query.permanentDelete(DeviceMac, {
                powerPlantId: new mongoose.Types.ObjectId(payload.id),
              });
              const powerPlant = await Query.bulkSave(DeviceMac, result);
              resolve({ data: powerPlant });
            });
        } else {
          logger.info('other');
        }
        // eslint-disable-next-line no-unreachable
      } catch (error) {
        logger.err('# Error while sync the DB', error);
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ error });
      }
    });
  };

  public static getProuctionData = async (payload: {
    ids: Array<string>;
    type: string;
  }): Promise<IResultAndError<any>> => {
    // return new Promise<any>(async (resolve, reject) => {
    logger.info('getProuctionData===>');
    try {
      let data: any = [];
      logger.info('payload===>', JSON.stringify(payload, null, 2));
      // logger.info(`Payload ===> ${payload}`);
      // * type & ids
      // * Get plants/devices from production database with $in query
      if (payload.type === 'powerplant') {
        logger.info('If powerplants');
        const criteria = {
          _id: {
            $in: payload.ids,
          },
        };

        const projection = {
          plantName: 1,
          state: 1,
          district: 1,
          city: 1,
          plantCapacity: 1,
          isDeleted: 1,
        };

        const options = {
          lean: true,
        };

        // * Get plants from production database with $in query
        // logger.info('ProdPowerPlant===>', JSON.stringify(ProdPowerPlant, null, 2));
        // logger.info('DeviceMac===>', JSON.stringify(DeviceMac, null, 2));
        data = await Query.find(ProdPowerPlant, criteria, projection, options);
        // logger.info('data===>', JSON.stringify(data, null, 2));
        // logger.info('data===>', JSON.stringify(data));
      } else if (payload.type === 'device') {
        logger.info('If devices');
        // * Get devices from production database with $in query
      }
      return {
        result: data,
        error: null,
      };
      // resolve(data);
    } catch (error) {
      logger.err(
        '# Error while fetching Data from production DbSyncUpService.getProuctionData()',
        error
      );
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
    // });
  };

  public static updateIsolatedDB = async (
    payload: {
      ids: Array<string>;
      type: string;
    },
    data: Array<any>
  ): Promise<IResultAndError<any>> => {
    try {
      logger.info('updateIsolatedDB===>');
      if (payload.type === 'powerplant') {
        await Promise.all(
          data.map(async (plant: IPowerPlantData) => {
            logger.info('plant===>', JSON.stringify(plant, null, 2));
            const id = plant._id;
            delete plant._id;
            await Query.updateOne(PowerPlant, { _id: id }, plant, { upsert: true });
          })
        );
      } else if (payload.type === 'device') {
        logger.info('payload.type===>', JSON.stringify(payload.type, null, 2));
      }
      return {
        result: 'Success',
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
}
