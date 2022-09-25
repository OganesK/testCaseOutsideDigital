import { FastifyReply, FastifyRequest } from 'fastify';

import { RegisterNewUserTypes, ValidateLoginTypes } from './types';
import UserAPI from '../api/user.api';

const api = new UserAPI();

const RegisterNewUserController = (req: FastifyRequest<{Body: RegisterNewUserTypes}>, reply: FastifyReply) => {
  if (!req.body.email) {
    reply.code(500).send('Provide email please');
  }
  if (!req.body.password) {
    reply.code(500).send('Provide password please');
  }
  if (!req.body.nickname) {
    reply.code(500).send('Provide nickname please');
  }
  try {
    api.registerNewUser(req.body.email, req.body.password, req.body.nickname);
  } catch (error) {
    throw new Error(error);
  }
};

const ValidateLoginController = (req: FastifyRequest<{Body: ValidateLoginTypes}>, reply: FastifyReply) => {
  if (!req.body.email) {
    reply.code(500).send('Provide email please');
  }
  if (!req.body.password) {
    reply.code(500).send('Provide password please');
  }

  try {
    api.validateLogin(req.body.email, req.body.password);
  } catch (error) {
    throw new Error(error);
  }
};

export { RegisterNewUserController, ValidateLoginController };
