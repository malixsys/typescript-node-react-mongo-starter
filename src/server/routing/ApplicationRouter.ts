// tslint:disable-next-line:no-duplicate-imports
import express, { Application as ExpressApplication, Router as ExpressRouter } from 'express';
import { ON_PROPERTIES_NAME } from './RouteDecorators';

import { httpErrorDelay } from '../utils/utils';

const errorHandler = (res: express.Response) => async (error: any) => {
  console.error('[SERVER] Error', error);
  const message = error && error.message && error.displayable ? error.message : 'An error occured';
  await httpErrorDelay();
  return res.status(500).json({
    success: false,
    message
  });
};

export class ApplicationRouter {
  public static addControllers<T>(controllers: T | T[], router: ExpressRouter): void {
    const ctlrs = controllers instanceof Array ? controllers : [controllers];

    ctlrs.forEach(ctlr => {
      if ((ctlr as any).methods) {
        this.setupRoutes(ctlr, router);
      }
    });
  }

  private static setupRoutes(controller: any, baseRouter: express.Router) {
    const path = (controller as any).onBasePath;
    const router = this.addRoutes(controller);
    baseRouter.use(path, router);
  }

  private static addRoutes(controller: any) {
    const router = express.Router();

    controller.methods.forEach((info: { [x: string]: any }) => {
      const params = info[ON_PROPERTIES_NAME];
      if (params) {
        const { options, call, path, method } = params;
        const target = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
          try {
            return controller[method](req, res, next).catch(errorHandler(res));
          } catch (error) {
            errorHandler(res)(error);
          }
        };
        switch (call) {
          case 'GET':
            if (options) {
              router.get(path, options, target);
            } else {
              router.get(path, target);
            }
            break;

          case 'POST':
            if (options) {
              router.post(path, options, target);
            } else {
              router.post(path, target);
            }
            break;

          case 'PUT':
            if (options) {
              router.put(path, options, target);
            } else {
              router.put(path, target);
            }
            break;

          case 'DELETE':
            if (options) {
              router.delete(path, options, target);
            } else {
              router.delete(path, target);
            }
            break;

          default:
            throw new Error(`Invalid properties on ${info}`);
        }
      }
    });
    return router;
  }
}
