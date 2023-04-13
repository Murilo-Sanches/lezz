import { Response } from 'express';
import jwt from 'jsonwebtoken';

declare module 'jsonwebtoken' {
  interface TypedJwtPayload extends jwt.JwtPayload {
    id: string;
    role: string;
  }
}

import { UserDocument } from '@Core/Models/Schemas/UserSchema';
import SendResponse from '@Base/Utilities/SendResponse';

export interface IUserWithoutPassword extends Omit<UserDocument, 'password'> {
  password: string | undefined;
}

class JsonWebToken {
  private readonly user: IUserWithoutPassword;
  private readonly statusCode: number;
  private readonly res: Response;

  public constructor(user: UserDocument, statusCode: number, res: Response) {
    this.user = user;
    this.statusCode = statusCode;
    this.res = res;

    // + Extrair o id do usuário que vai servir de payload no JWT
    const id = this.user.id;

    // + Criar o token JWT a partir de uma chave aleatória, com o corpo (payload) usando o ID do usuário
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // + Criar um objeto de opções para o cookie
    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      // secure: true,
    };

    // + Anexar na response o cookie gerado e as opções de configuração
    this.res.cookie('jwt', token, cookieOptions);

    // - Depois de ter criado a conta / logado, esse método vai ser chamado que tem como função enviar na response
    // - um objeto com as informações do usuário autenticado no sistema, não podemos enviar 100% todas as informações
    // - do usuário, a senha não pode ser enviada por questões de segurança, por isso tem que remover do output
    this.user.password = undefined;

    // + Enviar a response
    SendResponse(this.res, this.statusCode, 'success', 'Successfully Authenticated', { user: this.user, token });
  }

  public static Decode(token: string): jwt.TypedJwtPayload {
    // ! tanto faz o jeito
    // + jwt.verify confere se o token vindo não foi modificado
    // return <jwt.TypedJwtPayload>jwt.verify(token, process.env.JWT_SECRET);
    return jwt.verify(token, process.env.JWT_SECRET) as jwt.TypedJwtPayload;
  }
}

export default JsonWebToken;
