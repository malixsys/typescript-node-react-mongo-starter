import { NextFunction, Request, Response } from 'express';
import { oktaJwtVerifier, verifierOptions } from './okta';

interface Jwt {
  claims: {
    iss: string;
    exp: number;
    cid: string;
  };
}

interface VerifiedRequest extends Request {
  jwt: Jwt;
}

export const authenticationRequired = (req: VerifiedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    res.status(401);
    return next('Unauthorized');
  }

  const accessToken = match[1];

  return oktaJwtVerifier
    .verifyAccessToken(accessToken, 'api://default')
    .then((jwt: Jwt) => {
      req.jwt = jwt;
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
      next();
    })
    .catch((error: Error) => {
      console.error({ error });
      res.status(401).send(error.message);
    });
};
