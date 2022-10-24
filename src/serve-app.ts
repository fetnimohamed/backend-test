import express from 'express';
import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs';
import { join } from 'path';
import { logger } from './common/utils/logger';

export function UpdateIndex(dir: string) {
  const p = {
    default: join(dir, 'default.html'),
    index: join(dir, 'index.html'),
  };
  if (!existsSync(p.default)) renameSync(p.index, p.default);
  const buffer = readFileSync(p.default).toString();
  const a = buffer.replace('DEFAULT_API_URL', process.env.HOST);
  writeFileSync(p.index, a);
}

export function Serve(appName: string, port: number) {
  const app: express.Application = express();
  const host = process.env.HOSTCONFIG || '127.0.0.1';

  const buildDir = join(process.cwd(), `app/${appName}`);
  UpdateIndex(buildDir);
  app.use(express.static(buildDir));

  app.get('/*', function (req, res) {
    res.sendFile(join(buildDir, 'index.html'));
  });

  app.listen(port, host);
  console.log(appName, 'listening on ', host, ':', port);
  logger.info(`🚀 ${appName} listening on the port ${port}`);
}
