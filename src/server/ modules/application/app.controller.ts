import { Service } from 'typedi';
import { Response } from 'express';
import { Controller } from '../../routing/ClassDecorators';
import {Get, Put} from '../../routing/RouteDecorators';
import { HttpStatus } from '../../utils/HttpStatus';
import { IUserRequest } from '../../models/interfaces';
import {READ_PROFILE, UPDATE_USER_DATA} from '../../models/actions.constants';
import { AuthorizationMiddleware } from '../../utils/authorization.middleware';
import { UserService } from './user.service';

@Service()
@Controller('app')
export class AppController {
  constructor(private users: UserService) {}

  @Get('user', [AuthorizationMiddleware.resolve(READ_PROFILE)])
  public async getUser(req: IUserRequest, res: Response) {
    const { user } = req;
    res.status(HttpStatus.OK).json(user);
  }

  @Put('user', [AuthorizationMiddleware.resolve(UPDATE_USER_DATA)])
  public async updateData(req: IUserRequest, res: Response) {
    const { user } = req;
    await this.users.update(user, req.body);
    res.status(HttpStatus.NO_CONTENT);
  }
}
