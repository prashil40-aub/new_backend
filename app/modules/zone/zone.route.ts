import { Router } from 'express';
import { IApiRoute } from '@/interfaces';
import { validate } from '@/middleware';
import { ZONE_ROUTE_PREFIX } from './zone.constants';
import zoneController from './zone.controller';
import zoneValidation from './zone.validation';

class ZoneRouter {
  private static PREFIX = ZONE_ROUTE_PREFIX;

  public static createRoutes = (apiRouter: Router): IApiRoute => {
    apiRouter.route('/add').post(validate(zoneValidation.add), zoneController.createZone);

    return { router: apiRouter, apiPrefix: this.PREFIX };
  };
}

export default ZoneRouter;
