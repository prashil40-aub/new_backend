import { Model } from 'mongoose';

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
}
