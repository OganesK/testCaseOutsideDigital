import fastify from 'fastify';

import { PORT } from './config';
import { logger } from './logger';
import baseRoute from './routes/base.routes';

const server = fastify();

server.register(baseRoute);

const restServer = () => {
  server.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server started at http://0.0.0.0:${PORT}`);
  });
};

export {
  restServer,
};
