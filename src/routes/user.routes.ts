import { FastifyInstance } from 'fastify';

import { RegisterNewUserController, ValidateLoginController, GetUserController, UpdateUserDataController, DeleteUserHandler } from '../controllers/user.controller';

const userRoutes = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {
  fastify.post('/signup', RegisterNewUserController);

  fastify.post('/login', ValidateLoginController);

  fastify.get('/user', GetUserController);

  fastify.post('/user', UpdateUserDataController);

  fastify.delete('/user', DeleteUserHandler);

  next();
};

export default userRoutes;
