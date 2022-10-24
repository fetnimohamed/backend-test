import { HttpException } from '@/common/exceptions/HttpException';
import { isEmpty } from '@/common/utils/util';
import { logger } from '@/common/utils/logger';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { PrismaClient } from '@prisma/client';
import { PlayersDto } from './players.dto';

class PlayersService {
  public prisma = new PrismaClient();
  public playerDto = PlayersDto;
  public async getPlayers() {
    const players = await this.prisma.player.findMany();
    return players;
  }

  public async addPlayer(player) {
    const newPlayer = this.prisma.player.create({ data: player });
    return newPlayer;
  }

  public async updatePlayer(player) {
    const playerUpdate = this.prisma.player.update({ where: { id: player.id }, data: player });
    return playerUpdate;
  }
  public async deletePlayer(id: number) {
    const playerDelete = this.prisma.player.delete({ where: { id } });
    return playerDelete;
  }
  public async getPlayer(id: number) {
    const player = this.prisma.player.findUnique({ where: { id } });
    return player;
  }
}

export default PlayersService;
