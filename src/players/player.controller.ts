import { NextFunction, Request, Response } from 'express';
import PlayersService from './player.service';
import OfInProgressService from '@/configurationTRG/fabricationOrders/OfInProgress/ofInProgress.service';
import clotureQuartService from '@/clotureQuart/clotureQuart.service';
import QuartsService from '@/configurationTRG/config_quart/quarts.service';
import moment from 'moment';

class PlayersController {
  public playersService = new PlayersService();

  public getAllPlayers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.playersService.getPlayers();
      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
  public addPlayers = async (req: Request, res: Response, next: NextFunction) => {
    console.log('ddd', req.body);
    try {
      const player = req.body;
      const response = await this.playersService.addPlayer(player);
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
  public updatePlayers = async (req: Request, res: Response, next: NextFunction) => {
    console.log('ddd', req.body);
    try {
      const player = req.body;
      const response = await this.playersService.updatePlayer(player);
      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
  public deletePlayers = async (req: Request, res: Response, next: NextFunction) => {
    console.log('ddd', req.params.id);
    try {
      const id = req.params.id;
      const response = await this.playersService.deletePlayer(Number(id));
      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
  public getPlayerById = async (req: Request, res: Response, next: NextFunction) => {
    console.log('ddd', req.body.id);
    try {
      const id = req.params.id;
      const response = await this.playersService.getPlayer(Number(id));
      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
}

export default PlayersController;
