import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
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

  // * GET ALL query
  public static find = async <T = unknown>(
    ParsedModel: Model<T>,
    criteria: FilterQuery<T>,
    projection: ProjectionType<T>,
    options: QueryOptions<T>
  ): Promise<T[] | null> =>
    new Promise((resolve, reject) => {
      ParsedModel.find(criteria, projection, options)
        .then((res) => {
          logger.info('data', res);
          resolve(res);
        })
        .catch(reject);
    });
}
