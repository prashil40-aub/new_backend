import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import { logger } from '@/libs';

export class Query {
  // * Save
  public static save = async <T = unknown, U = unknown>(
    ParsedModel: Model<T>,
    data: U
  ): Promise<T> => {
    // try {
    return new Promise((resolve, reject) => {
      // console.log('# Query -> save start');
      // new ParsedModel(data).save((err: Error, savedData: unknown) => {
      //   if (err) {
      //     // console.error('# Query -> save -> Model.save -> err :', err);
      //     reject(err);
      //   }
      //   resolve(savedData);
      // });
      new ParsedModel(data)
        .save()
        .then((res) => {
          resolve(res);
        })
        .catch(reject);
    });
    // } catch (err) {
    //   //   console.error('# Query -> save -> catch: ', err);
    //   return err;
    // }
  };

  public static bulkSave = async <T = unknown>(ParsedModel: Model<T>, data: []): Promise<T> => {
    return new Promise((resolve, reject) => {
      ParsedModel.insertMany(data)
        .then((res: any) => {
          logger.info('# Save: ', res);
          resolve(res);
        })
        .catch(reject);
    });
  };

  // * GET ALL query
  public static find = <T = unknown>(
    ParsedModel: Model<T>,
    criteria: FilterQuery<T>,
    projection: ProjectionType<T>,
    options: QueryOptions<T>
  ): Promise<T[] | null> => {
    return new Promise((resolve, reject) => {
      // logger.info('criteria', JSON.stringify(criteria, null, 2));
      // logger.info('criteria', criteria.macAddress);
      logger.info('ParsedModel===>', JSON.stringify(ParsedModel, null, 2));
      ParsedModel.find(criteria, projection, options)
        .then((res) => {
          // logger.info('data', res);
          resolve(res);
        })
        .catch(reject);
    });
  };

  public static permanentDelete = <T = unknown>(
    ParsedModel: Model<T>,
    criteria: FilterQuery<T>
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      ParsedModel.deleteMany(criteria)
        .then((res) => {
          // logger.info('data', res);
          resolve(res);
        })
        .catch(reject);
    });
  };

  // * Add or Update single record
  public static updateOne = async <T = unknown>(
    ParsedModel: Model<T>,
    criteria: FilterQuery<T>,
    dataToSet: UpdateQuery<T>,
    options: QueryOptions<T>
  ): Promise<UpdateWriteOpResult> => {
    return new Promise((resolve, reject) => {
      ParsedModel.updateOne(criteria, dataToSet, options)
        .then((res: UpdateWriteOpResult) => {
          logger.info('res===>', JSON.stringify(res, null, 2));
          resolve(res);
        })
        .catch(reject);
    });
  };
}
