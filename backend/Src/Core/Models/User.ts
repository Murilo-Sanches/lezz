import mongoose, { CallbackWithoutResultAndOptionalError, Document } from 'mongoose';

import UserSchema, { UserDocument, IUser } from './Schemas/UserSchema';
import Cryptography from '../Controllers/Security/Cryptography';

// ! 👇 Virtuals permitem modificar/adicionar dados sem persistir no banco de dados
UserSchema.virtual('updated_at').get(function (this: UserDocument) {
  return Date.now();
});
UserSchema.virtual('domain').get(function (this: UserDocument) {
  return this.email.slice(this.email.indexOf('@') + 1);
  return this.email.split('@')[1];
});
// ! 👆 Virtuals permitem modificar/adicionar dados sem persistir no banco de dados

// + 👇 Middleware (also called pre and post hooks)

// ! 👇 DOCUMENT MIDDLEWARE this se refere ao documento sendo salvo
UserSchema.pre('save', async function (this: UserDocument, next: CallbackWithoutResultAndOptionalError) {
  if (!this.isModified('password')) return next();

  this.password = await Cryptography.Hash(this.password);
  next();
});
UserSchema.pre('save', function (this: UserDocument, next: CallbackWithoutResultAndOptionalError) {
  if (!this.isModified('password') || this.isNew) return next();

  // + Menos 1 segundo porque a criação do token é mais rápida
  this.password_changed_at = new Date(Date.now() - 1000);
  next();
});
// ! 👆 DOCUMENT MIDDLEWARE this se refere ao documento sendo salvo

// + /^find/ RegExp para tudo que começa com find, findById, findOne etc
// ! 👇 QUERY MIDDLEWARE, this aponta para a Query
UserSchema.pre(/^find/, async function (next: CallbackWithoutResultAndOptionalError) {
  this.find({ $active: { $ne: false } });
  next();
});
UserSchema.pre('aggregate', async function (next: CallbackWithoutResultAndOptionalError) {
  this.pipeline().unshift({ $match: { $active: { $ne: true } } });
  next();
});
// ! 👆 QUERY MIDDLEWARE, this aponta para a Query

// ! 👇 POST MIDDLEWARE, executa depois de todas as "pre", aqui temos o documento finalizado
UserSchema.post('save', async function (doc: Document, next: CallbackWithoutResultAndOptionalError) {
  console.log(doc);
  next();
});
// ! 👆 POST MIDDLEWARE, executa depois de todas as "pre", aqui temos o documento finalizado

// + 👇 Métodos de instância
UserSchema.methods.ComparePassword = async function (candidate: string, original: string): Promise<boolean> {
  return await Cryptography.IsEqual(candidate, original);
};
UserSchema.methods.PasswordChangedAfter = function (this: IUser, jwtIssuedAt: number): boolean {
  if (this.password_changed_at) {
    const changedAt = Number(this.password_changed_at) / 1000;
    const changedPasswordTimeStamp = parseInt(changedAt.toString(), 10);
    return changedPasswordTimeStamp > jwtIssuedAt;
  }
  return false;
};
UserSchema.methods.CreatePasswordResetToken = function (this: UserDocument): string {
  const { hash, random } = Cryptography.CreateTokenAndHash(32);
  this.password_reset_token = hash;
  this.password_reset_expires = new Date(Date.now() + 1 * 60 * 60 * 1000);
  this.save({ validateBeforeSave: true });
  return random;
};

const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;
