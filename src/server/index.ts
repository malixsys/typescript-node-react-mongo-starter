import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';
import { Application } from './ modules/application/application';
import { ApplicationModule } from './ modules/application/app.module';
dotenv.config();

const index = path.join(__dirname, '../client/index.html');

async function start() {
  const app = new Application(index);
  await app.setupExpress();
  const module = await ApplicationModule.create(app);
  return app.start();
}

start().catch(error => {
  console.error('[ERROR]', { error });
  process.exit(-1);
});
