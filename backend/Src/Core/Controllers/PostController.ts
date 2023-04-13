import Multer from '@Base/Services/Multer';
import Sharp from '@Base/Services/Sharp';
import { NextFunction, Request, Response } from 'express';

class PostController {
  protected UploadPostFiles() {
    return Multer.Fields();
  }

  protected ResizePostFiles(req: Request, res: Response, next: NextFunction) {
    if (!req.files) return next();
  }
}

export default PostController;
