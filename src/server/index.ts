import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import Bundler from "parcel-bundler";
import path from "path";
import SocketIOServer from "socket.io";

import {NextFunction, Request, Response} from "express";
import {authenticationRequired} from "./utils/middleware";

const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const server = new http.Server(app);
const io = SocketIOServer(server);

app.use((req: Request, res: Response, next: NextFunction) => {
  console.warn({ Log: `[${req.method.toUpperCase()}] ${req.url}` });
  next();
});

app.get('/api/cart', authenticationRequired, (req, res) => {
  res.status(200).json({ cartTotal: 0 });
});

const index = path.join(__dirname, '../client/index.html');
if(isProduction) {
  app.get('/', (req, res) => res.sendFile(index));
  app.use(express.static(path.join(__dirname, '../client'), {}));
} else {
  const bundler = new Bundler(index, {outDir: 'dist/client'});
  app.use(bundler.middleware());
}

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`[SERVER] Started at http://localhost:${port}`);
});

process.once('SIGTERM', () => {
  server.close(() => {
    process.kill(process.pid, 'SIGINT')
  });
});

