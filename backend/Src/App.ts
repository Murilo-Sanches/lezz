import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import hpp from 'hpp';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import ExpressMongoSanitize from 'express-mongo-sanitize';

import AuthenticationRoutes from '@Core/Routes/AuthenticationRoutes';
import colors from '@Base/Utilities/pallete';
import Exception from '@Base/Utilities/Exception';
import GlobalErrorHandler from '@Core/Controllers/GlobalErrorHandler';
import Tests from '@Core/Test';

class App {
  protected readonly App: express.Application;
  private AuthenticationRouter = new AuthenticationRoutes().Router;

  public constructor() {
    this.App = express();
    this.Middlewares();
    this.Routes();
  }

  private Middlewares(): void {
    this.App.use(helmet());
    this.App.use(cors());
    this.App.use(express.json()); 
    this.App.use(ExpressMongoSanitize()); // + Previnir NoSQL Injection limpando os operadores
    this.App.use(xss()); // + Prevenir HTML com JS vindo do usuário convertendo símbolos em entidades
    this.App.use(hpp()); // + Remover parâmetros duplicados
    this.App.use(cookieParser()); // + Essa middleware vai popular o req.cookie com o nome do cookie
    this.App.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
      req.requestTime = new Date().toLocaleTimeString('pt-br');
      next();
    });
    if (process.env.NODE_ENV === 'development') {
      this.App.use(morgan('dev'));
      console.log(colors.FgRed, 'development');
    }
    if (process.env.NODE_ENV === 'production') {
      console.log(colors.FgRed, 'production');
    }
  }

  private Routes(): void {
    this.App.use('/api/v1/users', this.AuthenticationRouter);
    this.App.use('/api/v1/posts', this.AuthenticationRouter);
    this.App.use('/api/v1/comments', this.AuthenticationRouter);
    this.App.use('/api/v1/messages', this.AuthenticationRouter);
    this.App.use('/api/v1/chats', this.AuthenticationRouter);
    this.App.use('/api/v1/groups', this.AuthenticationRouter);
    this.App.use('/api/v1/restricted/tests', Tests.AsyncDecorator);
    this.App.use('/api/v1/restricted/administrators/dashboard', this.AuthenticationRouter);
    this.App.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      next(new Exception(`Procurei em tudo e não consegui achar ${req.originalUrl}`, 404));
      // - Quando houver algo dentro do next(), o express automaticamente vai
      // - identificar que é um erro e pular todas as outras middlewares para
      // - chegar no Global Error Handling Middleware
    });
    this.App.use(GlobalErrorHandler.Void);
  }
}

export default App;
