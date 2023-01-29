/* eslint-disable @typescript-eslint/no-unsafe-call */
import Joi from 'joi';

class DBSyncUpValidation {
  dbSyncUpUpdate: { params: Joi.ObjectSchema };

  constructor() {
    this.dbSyncUpUpdate = {
      params: Joi.object().keys({
        ids: Joi.array().items(Joi.string().required()),
        type: Joi.string(),
      }),
    };
  }
}

export default new DBSyncUpValidation();
