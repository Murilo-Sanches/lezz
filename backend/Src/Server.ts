import { Application } from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';

import App from './App';
import colors from '@Base/Utilities/pallete';
import AbsolutePath from '../AbsolutePath';

class Server extends App {
  private readonly Server: Application;
  private readonly PORT: number;

  public constructor(port: number = 5555) {
    super();
    this.PORT = port;
    this.Server = this.App;
    this.Server.listen(this.PORT);
    config({ path: `${AbsolutePath}/.env` });
    console.log(colors.FgMagenta, 'Servidor Iniciado');
    this.Connection();
  }

  private async Connection(): Promise<void> {
    try {
      const URI = process.env.DATABASE_URI.replace('<password>', process.env.DATABASE_PASSWORD);

      await mongoose.connect(URI);
      console.log(colors.FgCyan, 'Conexão com o banco de dados estabelecida');
    } catch (err) {
      console.log(err);
    }
  }
}

new Server();
