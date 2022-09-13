import Joi from 'joi';

class ZoneValidation {
  getOne: { params: Joi.ObjectSchema };

  getAll: { body: Joi.ObjectSchema };

  add: { body: Joi.ObjectSchema };

  constructor() {
    this.getOne = {
      params: Joi.object().keys({
        id: Joi.number().required(),
      }),
    };

    this.getAll = {
      body: Joi.object().keys({}),
    };

    this.add = {
      body: Joi.object().keys({
        name: Joi.string().required(),
      }),
    };
  }
}

export default new ZoneValidation();
