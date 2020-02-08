import { NextFunction, Request, Response } from 'express';
import express from 'express';
import path from 'path';
import http, { Server } from 'http';
import { Router } from 'express';
import Bundler from 'parcel-bundler';
// import SocketIOServer from 'socket.io';
import { ApplicationRouter } from '../../routing/ApplicationRouter';

const isProduction = process.env.NODE_ENV === 'production';

export class Application {
  private index: string;
  private app: express.Express;
  private server: Server;
  private router: Router;

  constructor(index: string) {
    // this.io = SocketIOServer(this.server);
    this.index = index;
    this.app = express();
    this.server = new http.Server(this.app);
    this.router = express.Router();
  }

  addControllers<T>(controllers: T | T[]) {
    ApplicationRouter.addControllers(controllers, this.router);
  }

  setupExpress = async () => {
    const { app } = this;

    app.use((req: Request, res: Response, next: NextFunction) => {
      console.warn({ Log: `[${req.method.toUpperCase()}] ${req.url}` });
      next();
    });

    app.set('trust proxy', 1);

    app.disable('x-powered-by');

    app.use(express.json({ limit: '50mb' }));

    app.use(express.urlencoded({ extended: false }));

    app.use('/', this.router);
  };

  start = async () => {
    if (isProduction) {
      this.app.get('/', (req, res) => res.sendFile(this.index));
      this.app.use(express.static(path.join(__dirname, '../client'), {}));
    } else {
      const bundler = new Bundler(this.index, { outDir: 'dist/client' });
      this.app.use(bundler.middleware());
    }

    const port = process.env.PORT || 5000;
    this.server.listen(port, () => {
      console.log(`[SERVER] Started at http://localhost:${port}`);
    });

    process.once('SIGTERM', () => {
      console.log(`[SERVER] Closing...`);
      this.server.close(() => {
        process.kill(process.pid, 'SIGINT');
      });
    });
  };
}
