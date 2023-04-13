import mongoose from 'mongoose';

interface IUser {
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
  // [
  //   {
  //     type: string; // + "Point"
  //     coordinates: [string]; // + Lat, Long
  //     description: string;
  //   }
  // ];
  biography: string;
  status: string;
  following: mongoose.Types.ObjectId[];
  interests: string[];
  password_changed_at: Date;
  password_reset_token: string;
  password_reset_expires: Date;
  created_at: Date;
  CorrectPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
  PasswordChangedAfter(jwtIssuedAt: number): boolean;
}

interface IUserMethods {
  passwordChangedAt(jwtIssuedAt: number): boolean;
}

type UserModel = mongoose.Model<IUser, Record<string, never>, IUserMethods>;

const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
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
      enum: ['common-user', 'admin'],
      default: 'common-user',
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

// UserSchema.method('fullName', function fullName() {
// return this.name;
// });

const User = mongoose.model<IUser, UserModel>('User', UserSchema);
