/* eslint-disable @typescript-eslint/no-unsafe-call */
import Joi from 'joi';

class DBSyncUpValidation {
  dbSyncUpUpdate: { body: Joi.ObjectSchema };

  constructor() {
    this.dbSyncUpUpdate = {
      body: Joi.object().keys({
        ids: Joi.array().items(Joi.string().required()),
        type: Joi.string().required(),
      }),
    };
  }
}

export default new DBSyncUpValidation();
