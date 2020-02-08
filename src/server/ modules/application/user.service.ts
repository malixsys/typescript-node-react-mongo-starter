import { Model } from 'mongoose';

import { Inject, Service } from 'typedi';
import { USER_MODEL_TOKEN } from '../../models/tokens';
import { User } from '../../models/user.interface';

@Service()
export class UserService {
  constructor(@Inject(USER_MODEL_TOKEN) private readonly users: Model<User>) {}

  findByEmail(email: any) {
    if (`${email}`.trim() === '') {
      return Promise.resolve(undefined);
    }
    return this.users.findOne({ email: new RegExp(email, 'i') });
  }

  async update(user: User, data: any) {
    await this.users.findOneAndUpdate({ email: user.email }, { data });
  }
}
