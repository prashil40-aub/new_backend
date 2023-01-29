/* eslint-disable func-names */
import mongoose from 'mongoose';
import { Powerplant, productionDB } from '@/db';
import { logger } from '@/libs';
// import { ApiErrors } from '@/response_builder';
import DeviceMac from 'app/db/models/deviceMac/deviceMac.model';
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
              await Query.permanentDelete(Powerplant, {
                _id: new mongoose.Types.ObjectId(result._id),
              });
              const powerPlant = await Query.save(Powerplant, result);
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
}
