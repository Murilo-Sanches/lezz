import { NextFunction, Request, Response } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user: UserDocument;
    requestTime: string;
  }
}

import Email from '@Base/Utilities/Email';
import Exception from '@Base/Utilities/Exception';
import { UserDocument } from '@Core/Models/Schemas/UserSchema';
import SendResponse from '@Base/Utilities/SendResponse';
import User from '@Core/Models/User';
import Cryptography from '@Core/Controllers/Security/Cryptography';
import JsonWebToken from '@Core/Controllers/Security/JsonWebToken';
import Async from '@Base/Decorators/Async';
import Is from '@Base/Utilities/Is';

abstract class AuthenticationController {
  @Async()
  protected async SignUp(
    req: Request<
      never,
      never,
      {
        name: string;
        username: string;
        birth: string;
        gender: string;
        email: string;
        password: string;
        passwordConfirm: string;
      }
    >,
    res: Response,
    next: NextFunction
  ): Promise<void | JsonWebToken> {
    // + 1: Verificar se o corpo da requisição consta todas as informações necessárias
    if (
      !Is.empty(
        req.body.birth,
        req.body.email,
        req.body.gender,
        req.body.name,
        req.body.password,
        req.body.passwordConfirm,
        req.body.username
      )
    ) {
      return next(
        new Exception(
          'Não foi possível prosseguir com o cadastro porque as informações não foram preenchidas corretamente',
          400
        )
      );
    }

    // + 2: Verificar se as senhas conferem
    if (!Is.equal(req.body.password, req.body.passwordConfirm)) {
      return next(
        new Exception('Não pudemos realizar o cadastro porque as senhas são diferentes', 400)
      );
    }

    // + 3: Verificar se o "email" é um email válido
    if (!Email.IsValid(req.body.email)) {
      return next(new Exception('Por favor, insira um email válido', 400));
    }

    // + 4: As validações o mongoose cuida automaticamente no Schema
    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      birth: req.body.birth,
      gender: req.body.gender,
      email: req.body.email,
      password: req.body.password,
    });

    // + 5: SignUp concluída
    return new JsonWebToken(user, 201, res);
  }

  @Async()
  protected async Login(
    req: Request<Record<string, never>, Record<string, never>, { email: string; password: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void | JsonWebToken> {
    // + 1: Extrair o email e senha para logar
    const { email, password } = req.body;

    // + 2: Verificar se o corpo da requisição consta email e senha
    if (!Is.empty(email, password)) {
      return next(new Exception('Preencha email e senha para efetuar o login', 401));
    }

    // + 3: Verificar se o "email" é um email válido
    if (!Email.IsValid(email)) {
      return next(new Exception('Por favor, insira um email válido', 400));
    }

    // + 4: Executar a query pelo email, selecionar senha porque no schema o select é false por padrão
    const user = await User.findOne({ email }).select('+password');

    // + 5: Verificar se o usuário existe no banco de dados e verificar se a senha está correta
    if (!user || !(await user.ComparePassword(password, user.password))) {
      return next(
        new Exception('Não foi possível efetuar o login, email ou senha incorretos', 400)
      );
    }

    // + 6: Login concluído
    return new JsonWebToken(user, 201, res);
  }

  protected Logout(req: Request, res: Response): Response {
    // + O logout ocorre pela substituição do cookie antigo por um novo propositalmente inválido
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
    });
    return SendResponse(res, 200, 'success', 'Successfully Logged Out');
  }

  @Async()
  public static async Protect(req: Request, res: Response, next: NextFunction): Promise<void> {
    // + 1: Criar uma váriavel vazia para atribuir o valor a ela dentro do if e ainda ter acesso fora do if
    let token: string = '';

    // + 2: As boas práticas ditam que um JWT deve ser enviada por um header authorization com Bearer precedido
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // - O token vai ser mais ou menos assim "Bearer eyJhbGciOiJIUzI" Entre Bearer e o token tem um espaço vazio
      // - usando o split pelo espaço vazio vai ser transformado em ["Bearer", "eyJhbGciOiJIUzI"], aí é só pegar o
      // - segundo elemento
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      // - Outra possibilidade é o token vir por cookie, no caso o cookir se chamará JWT, que é o nome gerado pela
      // - classe JWT
      token = req.cookies.jwt;
    }

    // + 3: O usuário não está logado porque não tem token
    if (!token) {
      return next(new Exception('Você não está logado', 401));
    }

    // + 4: Decodificar o token
    const decoded = JsonWebToken.Decode(token);

    // + 5: Procurar o usuário a partir do id do token decodificado
    const user = await User.findById(decoded.id);

    // + 6: Conferir se existe um usuário
    if (!user) {
      return next(new Exception('O usuário que possuía esse token não existe mais', 401));
    }

    // + 7: Conferir se o usuário trocou a senha recentemente e está acessando com o token antigo
    if (user.PasswordChangedAfter(decoded.iat as number)) {
      return next(new Exception('Usuário trocou de senha recentemente', 401));
    }

    // + 8: Parte final, depois de toda essa validação o usuário está corretamente autenticado
    // - Alocar user na propriedade req.user para ser acessível para às próximas middlewares
    req.user = user;
    next();
  }

  @Async()
  protected async ForgotPassword(
    req: Request<never, never, { email: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // + 1: Extrair o email para iniciar a recuperação de senha
    const { email } = req.body;

    // + 2: Verificar se o email foi preenchido
    if (!email) {
      return next(
        new Exception('O email é obrigatório para avançar no processo de redefinição de senha', 400)
      );
    }

    // + 3: Verificar se o "email" é um email válido
    if (!Email.IsValid(email)) {
      return next(new Exception('Por favor, insira um email válido', 400));
    }

    // + 4: Buscar um usuário por esse email
    const user = await User.findOne({ email }).select('email');

    // + 5: Verificar se esse usuário existe
    if (!user) {
      return next(new Exception('Não existe esse email na nossa base de dados', 404));
    }

    // + 6: Criar o reset token e formular a URL para restaurar a senha
    const resetToken: string = user.CreatePasswordResetToken();
    const resetURL: string = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/reset-password/${resetToken}`;

    // ! 7: to-do
    try {
      // + 8: Enviar o email para o usuário com a URL para restaurar a senha
      new Email(user, resetURL).SendPasswordResetToken();
    } catch (err) {
      // + 9: Em caso de qualquer erro, todo o progresso feito até aqui vai ser restaurado por medidas de segurança
      user.password_reset_token = undefined;
      user.password_reset_expires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new Exception('Ouve um erro ao enviar o email, tente novamente mais tarde', 500));
    }
  }

  @Async()
  protected async ResetPassword(
    req: Request<{ token: string }, never, { password: string; passwordConfirm: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void | JsonWebToken> {
    // + 1: Recriar a hash usando o token vindo pelos parâmetros
    const encodedToken = Cryptography.CreateHash(req.params.token);

    // + 2: Buscar por um usuário que tenha esse mesmo token e para um token que ainda é válido
    const user = await User.findOne({
      password_reset_token: encodedToken,
      // - O token tem duração de 1 hora, então se busca pelo token que tem o valor maior que agora,
      // - assim, só vai ser buscado o usuário com o token que vai expirar no futuro, ou seja, válido
      password_reset_expires: { $gt: Date.now() },
    });

    // + 3: Verificar se o usuário existe
    if (!user) {
      return next(new Exception('Esse token não existe ou já foi expirado', 404));
    }

    // + 4: Verificar se o usuário preencheu corretamente os campos
    if (!Is.empty(req.body.password, req.body.passwordConfirm)) {
      return next(
        new Exception('Preencha corretamente os campos para podermos redefinir sua senha', 400)
      );
    }

    // + 5: Verificar se a senha e a senha de confirmação são iguais
    if (!Is.equal(req.body.password, req.body.passwordConfirm)) {
      return next(
        new Exception('Suas senhas não são iguais, corrija para pordermos redefinir sua senha', 400)
      );
    }

    // + 6: Modificar o objeto para a senha nova e remover os campos de restauração
    user.password = req.body.password;
    user.password_reset_token = undefined;
    user.password_reset_expires = undefined;

    // + 7: Salvar o documento
    await user.save();

    // + 8: Restauração concluída, mandar o novo token
    return new JsonWebToken(user, 200, res);
  }

  @Async()
  protected async UpdatePassword(
    req: Request<
      never,
      never,
      { currentPassword: string; passwordConfirm: string; password: string }
    >,
    res: Response,
    next: NextFunction
  ): Promise<void | JsonWebToken> {
    // + 1: Verificar se todos os campos necessários foram preenchidos
    if (!Is.empty(req.body.currentPassword, req.body.password, req.body.passwordConfirm)) {
      return next(
        new Exception('Para mudar a senha, deve ser preenchido corretamente os campos', 400)
      );
    }

    // + 2: Verificar se a senha atual do usuário é igual a senha de confirmação
    if (!Is.equal(req.body.password, req.body.passwordConfirm)) {
      return next(
        new Exception('As suas senhas não são iguais, por favor revise e tente novamente', 400)
      );
    }

    // + 3: as UserDocument - Casting para o compilador entender que "user" nunca vai ser nulo
    // - Nunca vai ser nulo porque a middleware Protect já assegura que o usuário é válido e aloca
    // - o usário na req, ou seja, vai ter um _id e consequentemente é certeza que esse usuário existe
    const user = (await User.findById(req.user._id).select('+password')) as UserDocument;

    // + 4: Verificar se o usuário realmente sabe a própria senha
    if (!(await Cryptography.IsEqual(req.body.currentPassword, user.password))) {
      return next(new Exception('Sua senha atual está incorreta', 401));
    }

    // + 5: Modificar o documento para a senha nova
    user.password = req.body.password;

    // + 6: Salvar o documento
    await user.save();

    // + 7: Atualização concluída, mandar o novo token
    return new JsonWebToken(user, 200, res);
  }

  // ! Deletar usuários, mudar depois para Admin Controller
  @Async()
  protected async deletebyuser(req: Request<{ username: string }>, res: Response) {
    const { username } = req.params;
    const doc = await User.findOneAndDelete({ username });
    console.log(doc);
    return SendResponse(res, 200, 'success', 'Deleted');
  }
}

export default AuthenticationController;
