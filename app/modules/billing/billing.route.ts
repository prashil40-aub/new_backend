import { Router } from 'express';
import { IApiRoute } from '@/interfaces';
import { validate } from '@/middleware';
import powerPlantController from '../powerPlant/powerplant.controller';
import powerplantValidation from '../powerPlant/powerplant.validation';
import { BILLING_ROUTE_PREFIX } from './billing.constants';
import billingController from './billing.controller';
import billingValidation from './billing.validation';

class BillingRouter {
  private static PREFIX = BILLING_ROUTE_PREFIX;

  public static createRoutes = (apiRouter: Router): IApiRoute => {
    apiRouter
      .route('/powerPlants')
      .get(validate(powerplantValidation.getAll), powerPlantController.getPlantDetails);

    apiRouter
      .route('/reading')
      .get(validate(billingValidation.getReadings), billingController.getReadings);

    return { router: apiRouter, apiPrefix: this.PREFIX };
  };
}

export default BillingRouter;
