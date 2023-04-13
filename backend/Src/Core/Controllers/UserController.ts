import { NextFunction, Request, Response } from 'express';

import Multer from '@Base/Services/Multer';
import Sharp from '@Base/Services/Sharp';
import Async from '@Base/Decorators/Async';
import User from '@Core/Models/User';
import SendResponse from '@Base/Utilities/SendResponse';
import { UserDocument } from '@Core/Models/Schemas/UserSchema';
import Exception from '@Base/Utilities/Exception';

class UserController {
  protected UploadUserPhoto() {
    return Multer.Single();
  }

  @Async()
  protected async ResizeUserPhoto(req: Request, res: Response, next: NextFunction) {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await Sharp.Restructure({
      file: req.file.buffer,
      w: 500,
      h: 500,
      quality: 90,
      path: `public/images/users/${req.file.filename}`,
    });

    next();
  }

  protected async UpdateMe(req: Request, res: Response): Promise<Response> {
    const filteredObj = this.FilterObj(
      req.body,
      'name',
      'username',
      'biography',
      'email',
      'status',
      'interests'
    );
    if (req.file) filteredObj.photo = req.file.filename;

    const user = (await User.findByIdAndUpdate(req.user.id, filteredObj, {
      new: true,
      runValidators: true,
    })) as UserDocument;

    return SendResponse(res, 200, 'success', 'Profile Updated Successfully', { user });
  }

  private FilterObj(
    obj: { [key: string]: string },
    ...allowedFields: string[]
  ): Record<string, string> {
    const newObj: Record<string, string> = {};
    Object.keys(obj).forEach((key) => {
      if (allowedFields.includes(key)) newObj[key] = obj[key];
    });
    return newObj;
  }

  @Async()
  protected async UploadFields(req: Request, res: Response, next: NextFunction) {
    if (!req.files) {
      return next(new Exception('a', 400));
    }

    req.body.images = [];
    await Promise.all(req.files.images.map(async (image, index) => {}));
  }
}

export default UserController;
