import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@/userManagement/users/users.dto';
import { RequestWithUser } from '@/auth/auth.interface';
import { User } from '@/userManagement/users/users.interface';
import AuthService from '@/auth/auth.service';
import { AuthDto, AuthOperateurDto } from './auth.dto';

class AuthController {
  public authService = new AuthService();

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: AuthDto = req.body;
      const { cookie, findUser, token } = await this.authService.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, jwt: token, message: 'login' });
    } catch (error) {
      next(error);
    }
  };
  public logInOperateur = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('innnnn');
      const userData: AuthOperateurDto = req.body.user;
      const { findUser, token } = await this.authService.loginOperateur(userData);
      res.status(200).json({ data: { user: findUser, accessToken: token }, message: 'login op' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  public logInAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: AuthDto = req.body;
      const { cookie, findUser, token } = await this.authService.loginAdmin(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, jwt: token, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
