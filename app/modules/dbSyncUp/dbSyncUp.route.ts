import { Router } from 'express';
import { IApiRoute } from '@/interfaces';
import DbSyncUpController from './dbSyncUp.controller';

const DBSYNCUP_ROUTE_PREFIX = '/dbsyncup';

class DbSyncUpRouter {
  private static PREFIX = DBSYNCUP_ROUTE_PREFIX;

  public static createRoutes = (apiRouter: Router): IApiRoute => {
    apiRouter.route('/').post(DbSyncUpController.updateDb);

    return { router: apiRouter, apiPrefix: this.PREFIX };
  };
}

export default DbSyncUpRouter;
