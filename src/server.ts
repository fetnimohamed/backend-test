import 'dotenv/config';
import App from '@/app';
import validateEnv from './common/utils/validateEnv';
import PlayersRoutes from './players/players.routes';

validateEnv();

const app = new App([new PlayersRoutes()]);

process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err);
  console.log(err);
  //process.exit(1); //mandatory (as per the Node.js docs)
});

app.listen();
