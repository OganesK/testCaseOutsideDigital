import { FastifyReply, FastifyRequest } from 'fastify';

import { version } from '../../package.json';

const base = (req: FastifyRequest, reply: FastifyReply) => {
  reply.send({ message: `Test case, ver ${version}` });
};

export { base };
