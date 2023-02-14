import Joi from 'joi';

class PowerplantValidation {
  // getOne: { params: Joi.ObjectSchema };

  getAll: { params: Joi.ObjectSchema };

  constructor() {
    // this.getOne = {
    //   params: Joi.object().keys({
    //     id: Joi.number().required(),
    //   }),
    // };

    this.getAll = {
      params: Joi.object().keys({}),
    };
  }
}

export default new PowerplantValidation();
