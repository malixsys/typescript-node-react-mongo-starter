import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ALGO = 'whirlpool';

/**
 * User Schema
 */
export const UserSchema: any = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
      index: { unique: true }
    },
    password: {
      type: String,
      default: '',
      match: [/.{7,}/, 'Password should be longer']
    },
    type: {
      type: String,
      enum: ['ind', 'pro', 'admin', 'god'],
      default: 'ind'
    },
    data: {
      type: Schema.Types.Mixed
    }
  },
  { collection: 'Users' }
);

UserSchema.set('toObject', { getters: true });

UserSchema.index({ email: 1 }, { unique: true });

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next: any) {
  // @ts-ignore
  const self = this;
  if (self.password && self.password.indexOf(ALGO + '$') !== 0) {
    self.password = self.hashPassword(self.password);
  }
  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = (password: string) => {
  const hashOptions = {
    algorithm: ALGO,
    saltLength: 32,
    iterations: 100
  };
  const passwordHash = require('password-hash');
  return passwordHash.generate(password, hashOptions);
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password: string) {
  const passwordHash = require('password-hash');
  return passwordHash.verify(password, this.password);
};
