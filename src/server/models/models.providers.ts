import mongoose from 'mongoose';
import { UserSchema } from './user.schema';
import grid from 'gridfs-stream';
import {
  DB_CONNECTION_TOKEN,
  GRID_TOKEN,
  USER_MODEL_TOKEN
} from './tokens';
import { Container } from 'typedi';

export const modelsProviders = [
  {
    provide: GRID_TOKEN,
    useFactory: () => () => {
      const connection: any = Container.get(DB_CONNECTION_TOKEN);
      if(process.env.SIMDB) {
        return connection.grid();
      }
      return grid(connection.db, mongoose.mongo);
    }
  },
  {
    provide: USER_MODEL_TOKEN,
    useFactory: () => {
      const connection: any = Container.get(DB_CONNECTION_TOKEN);
      console.timeStamp('TOKEN WRITTEN')
      return connection.model('User', UserSchema);
    }
  }
];
