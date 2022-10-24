import bcrypt from 'bcrypt';
import config from '../../node_modules/config';
import jwt from 'jsonwebtoken';
import { CreateUserDto } from '@/userManagement/users/users.dto';
import { HttpException } from '@/common/exceptions/HttpException';
import { DataStoredInToken, DataStoredInTokenOperateur, TokenData } from '@/auth/auth.interface';
import { User } from '@/userManagement/users/users.interface';
import userModel from '@/userManagement/users/users.model';
import { isEmpty } from '@/common/utils/util';
import { AuthDto, AuthOperateurDto } from './auth.dto';
import { Operator } from '@/userManagement/operators/operators.interface';
import QuartsService from '@/configurationTRG/config_quart/quarts.service';
import OperateurModel from '@/userManagement/operators/operators.model';

class AuthService {
  public users = userModel.User;
  public Operators = OperateurModel.Operator;
  public quartsService = new QuartsService();

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ matricule: userData.matricule });
    if (findUser) throw new HttpException(409, `You're matricule ${userData.matricule} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async login(userData: AuthDto): Promise<{ cookie: string; findUser: User; token: string }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ matricule: userData.matricule });
    if (!findUser) throw new HttpException(409, `You're matricule ${userData.matricule} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    if (findUser.permissionLevel !== 2) throw new HttpException(400, "You're not a responsable");
    if (!findUser.status) throw new HttpException(400, 'inactive user');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser, token: tokenData.token };
  }

  public async loginAdmin(userData: AuthDto): Promise<{ cookie: string; findUser: User; token: string }> {
    if (isEmpty(userData)) throw new HttpException(400, 'invalid data');

    const findUser: User = await this.users.findOne({ matricule: userData.matricule });
    if (!findUser) throw new HttpException(409, `You're matricule ${userData.matricule} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    if (findUser.permissionLevel !== 1) throw new HttpException(400, "You're not an admin");
    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser, token: tokenData.token };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ matricule: userData.matricule, password: userData.password });
    if (!findUser) throw new HttpException(409, `You're matricule ${userData.matricule} not found`);

    return findUser;
  }

  public async loginOperateur(userData: AuthOperateurDto): Promise<{ cookie: string; findUser: Operator; token: string }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
    //@ts-ignore
    const findUser: Operator = await this.Operators.findOne({ matricule: userData.matricule });
    //@ts-ignore
    if (!findUser) throw new HttpException(409, `You're matricule ${userData.matricule} not found`);

    const tokenData = await this.createTokenOperateur(findUser);
    console.log('tokenData', tokenData);

    //const cookie = this.createCookie(tokenData);
    //@ts-ignore
    return { findUser, token: tokenData.token };
  }

  public async createTokenOperateur(user: Operator): Promise<TokenData> {
    const dataStoredInToken: DataStoredInTokenOperateur = {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      matricule: user.matricule,
      processType: user.processType,
      createDate: user.createDate,
      updateDate: user.updateDate,
      deleteDate: user.deleteDate,
      permissionLevel: 3,
      status: user.status,
    };
    const secretKey: string = config.get('secretKey');
    const expiresIn: any = Math.abs(await this.quartsService.setduration());
    return { expiresIn, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createToken(user: User): TokenData {
    delete user.password;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
      permissionLevel: user.permissionLevel,
      firstName: user.firstName,
      lastName: user.lastName,
      matricule: user.matricule,
      updatedPassword: user.updatedPassword,
    };
    const secretKey: string = config.get('secretKey');
    const expiresIn: number = 28800; // 8h

    return { expiresIn, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn: '8h' }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
