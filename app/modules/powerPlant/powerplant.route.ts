import { Router } from 'express';
import { IApiRoute } from '@/interfaces';
import { validate } from '@/middleware';
import { POWERPLANT_ROUTE_PREFIX } from './powerplant.constants';
import powerPlantController from './powerplant.controller';
import powerPlantValidation from './powerplant.validation';

class PowerPlantRouter {
  private static PREFIX = POWERPLANT_ROUTE_PREFIX;

  public static createRoutes = (apiRouter: Router): IApiRoute => {
    apiRouter
      .route('/plantDetail')
      .get(validate(powerPlantValidation.getAll), powerPlantController.getPlantDetails);

    return { router: apiRouter, apiPrefix: this.PREFIX };
  };
}

export default PowerPlantRouter;
