/* eslint-disable @typescript-eslint/no-unsafe-call */
import joiDate from '@joi/date';
import Joi from 'joi';

class BillingValidation {
  joi = Joi.extend(joiDate) as typeof Joi;

  getReadings: { query: Joi.ObjectSchema };

  constructor() {
    this.getReadings = {
      query: Joi.object().keys({
        powerPlantIds: Joi.string().required(),
        startDate: this.joi.date().format('DD-MM-YYYY').max('now').required(),
        endDate: this.joi.date().format('DD-MM-YYYY').max('now').required(),
      }),
    };
  }
}

export default new BillingValidation();
