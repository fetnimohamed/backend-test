import config from '../../node_modules/config';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpException } from '@/common/exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@/auth/auth.interface';
import userModel from '@/userManagement/users/users.model';
import { User } from '@/userManagement/users/users.interface';
import express from 'express';
import bcrypt from 'bcrypt';
import usersService from '@/userManagement/users/users.service';
import QuartsService from '@/configurationTRG/config_quart/quarts.service';
import AuthService from './auth.service';
import { Operator } from '@/userManagement/operators/operators.interface';
import operatorsModel from '@/userManagement/operators/operators.model';
import ClotureQuartService from '@/clotureQuart/clotureQuart.service';
import { ClotureQuart } from '@/clotureQuart/clotureQuart.interface';

export default async function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  try {
    const Authorization = req.header('Authorization').split('Bearer ')[1] || null;
    if (Authorization) {
      const secretKey: string = config.get('secretKey');
      const verificationResponse = (await jwt.verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      let findUser: any =
        verificationResponse.permissionLevel === 3 ? await operatorsModel.Operator.findById(userId) : await userModel.User.findById(userId);
      if (findUser && findUser.status) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token : user does not exist'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
}

export function verifyUserPassword(req: express.Request, res: express.Response, next: express.NextFunction) {
  // try {
  //   const user: any = await usersService.getUserByMatriculeWithPassword(req.body.matricule);
  //   if (user && user.status === 1) {
  //     const passwordHash = user.password;
  //     const verifyPassword = await bcrypt.compare(req.body.password, passwordHash);
  //     if (verifyPassword) {
  //       // user data from db
  //       req.body.user = {};
  //       req.body.user.matricule = user.matricule;
  //       req.body.user.permissionLevel = user.permissionLevel;
  //       req.body.user.updatedPassword = user.updatedPassword;
  //       if (user.updateDate) req.body.user.updateDate = user.updateDate;
  //       return next();
  //     } else res.status(400).send({ errors: ['Invalid email and/or password'] });
  //   } else if (user.status === 0) {
  //     res.status(200).send({ code: 1, msg: ['INACTIVE USER'] });
  //   } else {
  //     res.status(400).send({ errors: ['Invalid email and/or password'] });
  //   }
  // } catch (err) {
  //   res.status(500).send({ errors: true });
  // }
}

export function verifyUserAsAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  //@ts-ignore
  if (req.user.permissionLevel === 3) return next();
  else res.status(401).send({ errors: ['wrong platform'] });
}

export function verifyUserAsResponsable(req: express.Request, res: express.Response, next: express.NextFunction) {
  //@ts-ignore
  if (req.user.permissionLevel === 2) return next();
  //@ts-ignore
  else res.status(401).send({ errors: ['wrong platform'] });
}

export function verifyUserAsComp(req: express.Request, res: express.Response, next: express.NextFunction) {
  //@ts-ignore
  if (req.user.permissionLevel === 3) return next();
  //@ts-ignore
  else res.status(401).send({ errors: ['wrong platform'] });
}

export function verifyUserAsNotOperator(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.body.user.permissionLevel !== 1) return next();
  else res.status(401).send({ errors: ['wrong platform'] });
}

export async function verifyUserAsOperator(req: express.Request, res: express.Response, next: express.NextFunction) {
  const quartsService = new QuartsService();
  const clotureQuartService = new ClotureQuartService();
  console.log('welcome');

  const operators = operatorsModel.Operator;
  const isShift = await quartsService.verifyShift(req.body.user.matricule, req.body.user.machine.machineId);
  const machineId = req.body.user.machine.machineId;
  const user: Operator = await operators.findOne({ matricule: req.body.user.matricule });
  //&& isShift add it to if to verifie shift
  console.log('is shift ', isShift);

  if (!user) {
    res.status(200).send({ code: 1, msg: ['Invalid matricule'] });
  } else if (!isShift) {
    res.status(200).send({ code: 2, msg: ['Invalid shift'] });
  } else if (user.processType.toString() !== req.body.user.machine.id_model.processtypeId) {
    res.status(200).send({ code: 4, msg: ['Invalid processType'] });
  } else if (user && isShift && user.processType.toString() == req.body.user.machine.id_model.processtypeId && user.status === true) {
    req.body.user.matricule = user.matricule;
    const cloture: ClotureQuart = await clotureQuartService.getLastClotureQuart(req.body.user.machine.machineId);
    const quartCode: String = await quartsService.quartCode();
    // req.user.permissionLevel = user.permissionLevel;
    //  console.log('etatlogin', cloture, cloture.quartCode, quartCode);

    req.body.user.machine.machineId = machineId;
    if (!cloture || cloture.quartCode != quartCode) {
      return next();
    } else {
      res.status(200).send({ code: 7, msg: ['Vous avez Cloturer votre Quart'] });
    }
  } else if (user.status === false) {
    res.status(200).send({ code: 5, msg: ['INACTIVE USER'] });
  } else {
    res.status(400).send({ errors: ['Invalid plateform'] });
  }
}

export function verifyClutureShift(req: express.Request, res: express.Response, next: express.NextFunction) {
  // const machine = req.body.user.machine;
  // console.log('auth machine', req.body.user);
  // const cloture: any = await clotureServices.getpassationsLastMachine(machine.machineId);
  // const code = await quartDao.quartCode();
  // if (!cloture || cloture.quartCode != code) {
  //   return next();
  // } else {
  //   res.status(200).send({ code: 7, msg: ['Vous avez Cloturer votre Quart'] });
  // }
}

export function verifyMachineIsUsed(req: express.Request, res: express.Response, next: express.NextFunction) {
  // const machine = req.body.user.machine;
  // console.log('auth machine', req.body.user.machine.isUsed);
  // if (req.body.user.machine.isUsed === 0) {
  //   machine.isUsed = 1;
  //   const machineId = await machineServices.getMachineById(machine.machineId);
  //   machineId[0].isUsed = 1;
  //   const editMachine = await machineServices.updateMachine(machineId[0]);
  //   return next();
  // } else {
  //   res.status(200).send({ code: 6, msg: ['Machine used !'] });
  // }
}
