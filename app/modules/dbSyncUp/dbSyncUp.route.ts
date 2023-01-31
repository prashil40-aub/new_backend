import { Router } from 'express';
import { IApiRoute } from '@/interfaces';
import { validate } from '@/middleware';
import DbSyncUpController from './dbSyncUp.controller';
import dbSyncUpValidation from './dbSyncUp.validation';

const DBSYNCUP_ROUTE_PREFIX = '/dbsyncup';

class DbSyncUpRouter {
  private static PREFIX = DBSYNCUP_ROUTE_PREFIX;

  public static createRoutes = (apiRouter: Router): IApiRoute => {
    apiRouter
      .route('/byId')
      .post(validate(dbSyncUpValidation.dbSyncUpUpdate), DbSyncUpController.syncRecordsById);
    apiRouter.route('/bulk').post(DbSyncUpController.bulkSyncUp);
    return { router: apiRouter, apiPrefix: this.PREFIX };
  };
}

export default DbSyncUpRouter;
