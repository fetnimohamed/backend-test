import { Router } from 'express';
import AuthController from '@/auth/auth.controller';
import { CreateUserDto } from '@/userManagement/users/users.dto';
import { Routes } from '@/common/interfaces/routes.interface';
import authMiddleware, { verifyUserAsOperator } from '@/auth/auth.middleware';
import validationMiddleware from '@/common/middlewares/validation.middleware';

import { AuthDto, AuthOperateurDto } from './auth.dto';

class AuthRoute implements Routes {
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`/login`, validationMiddleware(AuthDto, 'body'), this.authController.logIn);
    this.router.post(`/loginadmin`, validationMiddleware(AuthDto, 'body'), this.authController.logInAdmin);
    this.router.post(`/logout`, authMiddleware, this.authController.logOut);
    this.router.post(`/loginOperateur`, validationMiddleware(AuthOperateurDto, 'body'), verifyUserAsOperator, this.authController.logInOperateur);
  }
}

export default AuthRoute;
