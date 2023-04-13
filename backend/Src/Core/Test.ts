import { NextFunction, Request, Response } from 'express';

import Async from '@Base/Decorators/Async';
import Exception from '@Base/Utilities/Exception';

class Tests {
  // ! Testes com o decorator
  @Async()
  public static async AsyncDecorator(req: Request, res: Response, next: NextFunction) {
    throw new Error('Erro esperado inesperado');

    const random = Math.random();

    if (random > 0.5) {
      return next(new Exception('Azar meu mano', 400));
    }

    res.json({ message: 'deu sorte fdp' });
  }
}

export default Tests;
