import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface UserDocument extends IUser, mongoose.Document {
  fullName: string;
  createdAt: string;
  updatedAt: string;
  ComparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  password: {
    type: String,
    required: true,
  },
});

UserSchema.index({ email: 1 });

UserSchema.virtual('fullName').get(function (this: UserDocument): string {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.pre('save', async function (this: UserDocument, next: mongoose.CallbackWithoutResultAndOptionalError) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;
  return next();
});
UserSchema.methods.ComparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as UserDocument;
  return await bcrypt.compare(candidatePassword, user.password);
};

const User = mongoose.model<UserDocument>('User', UserSchema);
