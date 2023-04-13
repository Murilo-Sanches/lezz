import { Response } from 'express';

import { IUser, UserDocument } from '@Core/Models/Schemas/UserSchema';
import { IUserWithoutPassword } from '@Core/Controllers/Security/JsonWebToken';

const SendResponse = (
  res: Response,
  statusCode: number,
  status: 'success' | 'fail' | 'error',
  message: string,
  body?: { user?: IUser | UserDocument | IUserWithoutPassword; token?: string }
) => {
  return res.status(statusCode).json({
    status,
    message,
    data: body,
  });
};

export default SendResponse;
