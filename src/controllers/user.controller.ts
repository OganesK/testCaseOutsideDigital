/* eslint-disable sonarjs/no-duplicate-string */
import { FastifyReply, FastifyRequest } from 'fastify';

import UserAPI from '../api/user.api';
import { RegisterNewUserTypes, ValidateLoginTypes, UpdateUserTypes } from './types';

const api = new UserAPI();

const RegisterNewUserController = async (req: FastifyRequest<{Body: RegisterNewUserTypes}>, reply: FastifyReply) => {
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
    const replyData = await api.registerNewUser(req.body.email, req.body.password, req.body.nickname);

    reply.code(200).send(replyData);
  } catch (error) {
    throw new Error(error);
  }
};

const ValidateLoginController = async (req: FastifyRequest<{Body: ValidateLoginTypes}>, reply: FastifyReply) => {
  if (!req.body.email) {
    reply.code(500).send('Provide email please');
  }
  if (!req.body.password) {
    reply.code(500).send('Provide password please');
  }

  try {
    const replyData = await api.validateLogin(req.body.email, req.body.password);

    reply.code(200).send(replyData);
  } catch (error) {
    throw new Error(error);
  }
};

const GetUserController = async (req: FastifyRequest<{Headers: { token: string}}>, reply: FastifyReply) => {
  if (!req.headers.token) {
    reply.code(500).send('Not authorized');
  }

  try {
    const user = await api.getUser(req.headers.token);

    reply.code(200).send(user);
  } catch (error) {
    throw new Error(error);
  }
};

const UpdateUserDataController = async (req: FastifyRequest<{Headers: { token: string}, Body: UpdateUserTypes}>, reply: FastifyReply) => {
  if (!req.headers.token) {
    reply.code(500).send('Not authorized');
  }

  try {
    const updatedUser = await api.updateUserData(req.headers.token, req.body.email, req.body.password, req.body.nickName);

    reply.code(200).send(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
};

const DeleteUserHandler = async (req: FastifyRequest<{Headers: { token: string}}>, reply: FastifyReply) => {
  if (!req.headers.token) {
    reply.code(500).send('Not authorized');
  }

  try {
    const deleteUserReply = await api.deleteUser(req.headers.token);

    reply.code(200).send(deleteUserReply);
  } catch (error) {
    throw new Error(error);
  }
};

export { RegisterNewUserController, ValidateLoginController, GetUserController, UpdateUserDataController, DeleteUserHandler };
