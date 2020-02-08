import 'reflect-metadata';
import { Container } from 'typedi';

import { HttpStatus } from './HttpStatus';
import {database} from "../models/database";

export function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export const httpErrorDelay = async () => {
  return delay(Math.random() * 1000 + 1000);
};

export const badRequestError = (message:any) => ({
  status: HttpStatus.BAD_REQUEST,
  result: { success: false, message }
});

export interface IProvider {
  provide: string;
  useFactory(): Promise<object>;
}
export const instantiate = async (providers: IProvider[]) => {
  const promises = providers.map(async (provider: IProvider) => {
    const factory = provider.useFactory();
    const ret = factory.then ? await factory : factory;
    Container.set(provider.provide, ret);
  });
  return Promise.all(promises);
};
