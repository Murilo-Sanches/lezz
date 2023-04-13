import { IRouter, Router } from 'express';

import AuthenticationController from '@Core/Controllers/AuthenticationController';

class AuthenticationRoutes extends AuthenticationController {
  public Router: IRouter;

  public constructor() {
    super();
    this.Router = Router();
    this.AuthenticationRoutes();
  }

  private AuthenticationRoutes(): void {
    this.Router.post('/signup', this.SignUp);
    this.Router.post('/login', this.Login);

    this.Router.post('/forgot-password', this.ForgotPassword);
    this.Router.patch('/reset-password');

    this.Router.delete('/delete/:username', this.deletebyuser);
  }
}

export default AuthenticationRoutes;
