import { Injectable, NestMiddleware } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { Request, Response } from 'express';

// for firebase
var admin = require('firebase-admin');
import * as serviceAccount from './serviceAccountKey.json';

@Injectable()
export class PreAuthMiddleware implements NestMiddleware {
  private auth: any;

  constructor() {
    this.auth = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization;
    if (token != null && token != '') {
      this.auth
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decodedToken) => {
          req['user'] = {
            email: decodedToken.email,
            roles: decodedToken.roles || [],
            type: decodedToken.type,
          };
          next();
        })
        .catch(() => {
          PreAuthMiddleware.accessDenied(req.url, res);
        });
    } else {
      PreAuthMiddleware.accessDenied(req.url, res);
    }
  }

  private static accessDenied(url: string, res: Response) {
    res.status(401).json({
      statusCode: 401,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'access denied',
    });
  }
}
