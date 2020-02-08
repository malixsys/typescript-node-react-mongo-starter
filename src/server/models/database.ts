import mongoose from "mongoose";
import timestamps from 'mongoose-timestamp';
import {Container} from "typedi";
import {DB_CONNECTION_TOKEN} from "./tokens";

export const database = {
    connect: async (): Promise<any> => {
        return new Promise(async resolve => {
            Container.set(DB_CONNECTION_TOKEN, mongoose.connection);

            mongoose.plugin(timestamps, {
                createdAt: 'created',
                updatedAt: 'updated'
            });

            mongoose.connection.once('open', () => {
                console.log('[DATABASE] Connection open');
            });
            mongoose.connection.once('connected', () => {
                console.log('[DATABASE] Connection connected');
                mongoose.connection.on('error', error => {
                    console.error('[ERROR]', { error });
                    process.exit(-1);
                });
                resolve();
            });
            mongoose.connection.once('error', (...args) => {
                console.error('[ERROR]', { args });
            });

            return mongoose.connect(`${process.env.MONGO_URL}`, { useFindAndModify: false });
        });
    }
};
