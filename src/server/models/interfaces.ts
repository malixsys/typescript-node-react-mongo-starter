import { User } from './user.interface';
import {Request} from "express";

export interface IResponse {
  status(code: number): IResponse;
  json(body?: any): IResponse;
}

export interface IUserRequest extends Request {
  user: User;
  auth?: any;
  body: any;
  query: any;
  params: any;
}

export class HttpException extends Error {
  constructor(message: string, public code: number) {
    super(message);
  }
}
