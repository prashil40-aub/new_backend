/* eslint-disable @typescript-eslint/no-unsafe-call */
import Joi from 'joi';

class BillingValidation {
  getReadings: { params: Joi.ObjectSchema };

  constructor() {
    this.getReadings = {
      params: Joi.object().keys({
        powerPlantIds: Joi.string(),
        startDate: Joi.date().max('now'),
        endDate: Joi.date().max('now'),
      }),
    };
  }
}

export default new BillingValidation();
