import { Model } from 'mongoose';
import { USER_MODEL_TOKEN } from '../models/tokens';
import { User } from '../models/user.interface';
import auth from './authorization';
import { READ_PROFILE, UPDATE_USER_DATA } from '../models/actions.constants';
import { Container, Service } from 'typedi';
import { IUserRequest } from '../models/interfaces';
import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from './HttpStatus';
import { oktaJwtVerifier, verifierOptions } from './okta';

interface Jwt {
  claims: {
    iss: string;
    exp: number;
    cid: string;
    sub: string;
  };
}

let wasSetup = false;
const getReqUser = (req: IUserRequest) => {
  return req.user || { unique_id: 'anonymous', email: 'anonymous' };
};

@Service()
export class AuthorizationMiddleware {
  private models: {
    users: () => Model<User>;
  };

  constructor() {
    this.setup();
    this.models = {
      users: () => Container.get(USER_MODEL_TOKEN)
    };
  }

  public static resolve(permission?: string) {
    const instance = Container.get(AuthorizationMiddleware);
    return (req: IUserRequest, res: Response, next: NextFunction) => {
      req.auth = auth;
      const authHeader = req.headers.authorization || '';
      const match = authHeader.match(/Bearer (.+)/);

      if (!match) {
        res.status(401);
        return next('Unauthorized');
      }

      const accessToken = match[1];

      return oktaJwtVerifier
        .verifyAccessToken(accessToken, 'api://default')
        .then(async (jwt: Jwt) => {
          // @ts-ignore
          const { claims } = jwt;
          const exp = new Date(Number(`${claims.exp}000`));
          if (exp < new Date(Date.now())) {
            throw new Error('Token expired');
          }
          if (claims.cid !== verifierOptions.clientId) {
            throw new Error('Invalid token');
          }
          if (claims.iss !== verifierOptions.issuer) {
            throw new Error('Invalid token');
          }
          const user = await instance.getUser(jwt.claims.sub);
          if (!user) {
            console.error({ NotFound: jwt.claims.sub });
            return res.status(HttpStatus.FORBIDDEN).json(`Not allowed to ${permission}`);
          }
          req.user = user;
          if (permission) {
            const permitted = await auth.can(req, permission);
            if (!permitted) {
              console.error({ cannot: permission, url: req.originalUrl, method: req.method });
              return res.status(HttpStatus.FORBIDDEN).json(`Not allowed to ${permission}`);
            }
          }
          next();
        })
        .catch((error: Error) => {
          console.error({ error });
          res.status(401).send(error.message);
        });
    };
  }

  private getUser(email) {
    if (`${email}`.trim() === '') {
      return Promise.resolve(undefined);
    }
    return this.models.users().findOne({ email: new RegExp(email, 'i') });
  }

  private setup() {
    if (wasSetup) {
      return;
    }
    wasSetup = true;

    this.addUserTypeRoles();

    auth.role('admin', async req => ['admin', 'god'].indexOf(getReqUser(req).type) > -1);

    auth.role('authenticated', async req => ['ind', 'pro', 'admin', 'god'].indexOf(getReqUser(req).type) > -1);

    auth.action(READ_PROFILE, ['authenticated']);

    auth.action(UPDATE_USER_DATA, ['admin']);
  }

  private addUserTypeRoles() {
    auth.role('god', async req => {
      return getReqUser(req).type === 'god';
    });

    auth.role('admin', async req => {
      return getReqUser(req).type === 'admin';
    });

    auth.role('ind', async req => {
      return getReqUser(req).type === 'ind';
    });

    auth.role('pro', async req => {
      return getReqUser(req).type === 'pro';
    });
  }
}
