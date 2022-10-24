import 'dotenv/config';
import App from '@/app';
import AuthRoute from '@/auth/auth.route';
import IndexRoute from '@/index/index.route';
import UsersRoute from '@/userManagement/users/users.route';
import validateEnv from './common/utils/validateEnv';
import ProcessTypeRoute from './configurationTRG/processType/processType.route';
import MachineCycleRoute from './configurationTRG/machineCycle/machineCycle.route';
import MachineModelRoute from './configurationTRG/machineModels/machineModel.route';
import MachineRoute from './configurationTRG/machine/machine.route';
import ArticleRoute from './configurationTRG/fabricationOrders/articles/article.route';
import HistoryRoute from './configurationTRG/fabricationOrders/history/history.route';
import ConfigNonTrgRoute from './configNonTrg/configNonTrg.route';
import OFInProgressRoute from './configurationTRG/fabricationOrders/OfInProgress/ofInProgress.route';
import OFRoute from './configurationTRG/fabricationOrders/OF/of.route';
import OperatorRoute from './userManagement/operators/operators.route';
import OvertureMachineRoutes from './configurationTRG/overtureMachines/overtureMachine.routes';
import QuartsRoutes from './configurationTRG/config_quart/quart.route';
import MachineStatusRoutes from './machineStatus/machineStatus.routes';
import levelRoute from './configurationTRG/level/level.route';
import mappingRoute from './configurationTRG/mapping/mapping.route';
import ClotureQuartRoute from './clotureQuart/clotureQuart.route';
import ligneRoute from './configurationTRG/ligne/ligne.route';
import AnalyseRoute from './analyse/analyse.route';
import { HttpException } from './common/exceptions/HttpException';
import PlayersRoutes from './players/players.routes';

validateEnv();

const app = new App([
  // new IndexRoute(),
  // // new UsersRoute(),
  // new AuthRoute(),
  // new ProcessTypeRoute(),
  // new MachineCycleRoute(),
  // new MachineModelRoute(),
  // new MachineRoute(),
  // new ArticleRoute(),
  // new HistoryRoute(),
  // new ConfigNonTrgRoute(),
  // new OFInProgressRoute(),
  // new OFRoute(),
  // new OperatorRoute(),
  // new OvertureMachineRoutes(),
  // new QuartsRoutes(),
  // new MachineStatusRoutes(),
  // new levelRoute(),
  // new mappingRoute(),
  // new ClotureQuartRoute(),
  // new ligneRoute(),
  // new AnalyseRoute(),
  new PlayersRoutes(),
]);

process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err);
  console.log(err);
  //process.exit(1); //mandatory (as per the Node.js docs)
});

app.listen();
