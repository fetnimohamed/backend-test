import { Router } from 'express';

import { Routes } from '@/common/interfaces/routes.interface';
import validationMiddleware from '@/common/middlewares/validation.middleware';
import authMiddleware, { verifyUserAsComp, verifyUserAsResponsable } from '@/auth/auth.middleware';
import PlayersController from './player.controller';

class PlayersRoutes implements Routes {
  public path = '/players';
  public router = Router();
  public playersController = new PlayersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, this.playersController.getPlayerById);
    this.router.get(this.path, this.playersController.getAllPlayers);
    this.router.post(this.path, this.playersController.addPlayers);
    this.router.put(this.path, this.playersController.updatePlayers);
    this.router.delete(`${this.path}/:id`, this.playersController.deletePlayers);
  }
}

export default PlayersRoutes;
