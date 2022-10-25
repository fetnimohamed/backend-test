import { PrismaClient } from '@prisma/client';
import fs from 'fs';

class PlayersService {
  public prisma = new PrismaClient();
  public async getPlayers() {
    const players = await this.prisma.player.findMany();
    return players;
  }

  public async addPlayer(player, picture) {
    fs.writeFileSync(__dirname + '/pictures/' + picture.name, picture.data);
    const newPlayer = this.prisma.player.create({ data: { ...player, picture: __dirname + 'pictures\\' + picture.name } });
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
