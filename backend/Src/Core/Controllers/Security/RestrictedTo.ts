import { NextFunction, Request, Response } from 'express';

import Exception from '@Base/Utilities/Exception';

class Restricted {
  public static To(...roles: string[]) {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (!roles.includes(req.user.role)) {
        console.log(req.user.role);
        return next(new Exception('Você não tem permissão para perfomar essa ação', 403));
      }
      next();
    };
  }
}

export default Restricted;
