import { IRouter, Router } from 'express';

import UserController from '@Core/Controllers/UserController';
import AuthenticationController from '@Core/Controllers/AuthenticationController';

class UserRoutes extends UserController {
  public Router: IRouter;

  public constructor() {
    super();
    this.Router = Router();
    this.UserRoutes();
  }

  private UserRoutes(): void {
    this.Router.post(
      '/update-me',
      AuthenticationController.Protect,
      this.UploadUserPhoto,
      this.ResizeUserPhoto
    );
  }
}

export default UserRoutes;
