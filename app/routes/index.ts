import { Router } from 'express';
import type { IRoutes } from '@/interfaces';
import { AuthRouter } from '@/modules/auth';
import { BillingRouter } from '@/modules/billing';
import { PowerPlantRouter } from '@/modules/powerPlant';
import { UserRouter } from '@/modules/user';
import { ZoneRouter } from '@/modules/zone';

class RootRouter {
  public static prepareAllRoutes(router: Router) {
    // * get All Module Router and their prefix
    const { router: userRouter, apiPrefix: userPrefix } = UserRouter.createRoutes(router);
    const { router: adminRouter, apiPrefix: adminPrefix } = AuthRouter.createRoutes(router);
    const { router: zoneRouter, apiPrefix: zonePrefix } = ZoneRouter.createRoutes(router);
    const { router: powerPlantRouter, apiPrefix: powerPlantPrefix } =
      PowerPlantRouter.createRoutes(router);
    const { router: billingRouter, apiPrefix: billingPrefix } = BillingRouter.createRoutes(router);

    // * Accumulate All Routes of Application
    const allRoutes: IRoutes[] = [
      {
        path: adminPrefix,
        route: adminRouter,
      },
      {
        path: userPrefix,
        route: userRouter,
      },
      {
        path: zonePrefix,
        route: zoneRouter,
      },
      {
        path: powerPlantPrefix,
        route: powerPlantRouter,
      },
      {
        path: billingPrefix,
        route: billingRouter,
      },
    ];

    return allRoutes;
  }

  public static createAllRoutes = (router: Router) => {
    const allRoutes = this.prepareAllRoutes(router);

    // * Attach all paths and route to main API Router
    allRoutes.forEach((route) => {
      router.use(route.path, route.route);
    });

    return router;
  };
}
export default RootRouter;
