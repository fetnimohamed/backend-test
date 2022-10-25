import { NextFunction, Request, Response } from 'express';
import PlayersService from './player.service';

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
    try {
      const player = req.body;
      const picture = req.files.file;
      if (picture.mimetype == 'image/png' && req.body) {
        const response = await this.playersService.addPlayer(player, picture);
        return res.status(200).json({ response });
      }
      return res.status(404).send({ mesage: 'not the good data ' });
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
