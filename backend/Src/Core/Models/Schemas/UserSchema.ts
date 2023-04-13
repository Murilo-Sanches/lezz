import mongoose from 'mongoose';

export interface IUser {
  name: string;
  username: string;
  birth: string;
  gender: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
  banned: boolean;
  profile_picture: string;
  background_photo: string;
  location: any;
  biography: string;
  status: string;
  following: mongoose.Types.ObjectId[];
  interests: string[];
  password_changed_at: Date;
  password_reset_token: string | undefined;
  password_reset_expires: Date | undefined;
  created_at: Date;
}

export interface UserDocument extends IUser, mongoose.Document {
  // ! Coisas que o mongoose cria, virtuals, ids
  domain: string;
  updated_at: string;
  ComparePassword(candidate: string, original: string): Promise<boolean>;
  PasswordChangedAfter(jwtIssuedAt: number): boolean;
  CreatePasswordResetToken(): string;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Você precisa preencher seu nome'],
    },
    username: {
      type: String,
      required: [true, 'Por favor escolha um nome de usuário'],
      unique: true,
      maxlength: [20, 'Apenas nomes de usuário com até 20 caracteres são permitidos'],
      minlength: [6, 'Por favor escolha um nome de usuário maior que 6 caracteres'],
      trim: true,
    },
    birth: {
      type: String,
      required: [true, 'Insira uma data de nascimento'],
    },
    gender: {
      type: String,
      enum: ['Masculino', 'Feminino', 'Cisgênero', 'Transgênero', 'Agênero', 'Não-binário'],
      required: [true, 'Por favor selecione como você se identifica'],
    },
    email: {
      type: String,
      required: [true, 'Você precisa especificar um email'],
      unique: true,
      lowercase: true,
      select: false,
    },
    password: {
      type: String,
      required: [true, 'Preencha a senha'],
      maxlength: [32, 'Crie uma senha com até 32 caracteres'],
      minlength: [6, 'Crie uma senha maior que 6 caracteres'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    banned: {
      type: Boolean,
      default: false,
      select: false,
    },
    profile_picture: {
      type: String,
      default: 'ppdefault.jpg',
    },
    background_photo: {
      type: String,
      default: 'bpdefault.jpg',
    },
    location: {
      // GeoJSON // Latitude e Longitude 38.720958, -9.140571
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
    },
    biography: {
      type: String,
      maxlength: [150, 'A biografia do seu perfil não pode ultrapassar 150 caracteres'],
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'busy', 'invisible'],
      default: 'online',
    },
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
    interests: [String],
    password_changed_at: { type: Date, select: false },
    password_reset_token: { type: String, select: false },
    password_reset_expires: { type: Date, select: false },
    created_at: { type: Date, default: Date.now() },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default UserSchema;
