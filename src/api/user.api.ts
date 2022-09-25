import bcrypt from 'bcrypt';
import prisma from '../prisma-client';

import { validatePassword } from '../utils';
import { createToken, verifyToken } from '../integrations/jwt/index';

class UserAPI {
  public async registerNewUser (email: string, password: string, nickName: string) {
    const existingUsers = await prisma.user.findMany({});

    if (existingUsers.filter((user) => user.email === email).length !== 0) {
      return 'User with provided email already exists';
    }

    const passValidationData = validatePassword(password);

    if (!passValidationData.digit) {
      return 'There is no numbers in provided password';
    }
    if (!passValidationData.lower) {
      return 'There is no lower case in provided password';
    }
    if (!passValidationData.upper) {
      return 'There is no upper case in provided password';
    }
    if (!passValidationData.lengthCheck) {
      return 'Password needs to be at least 8-length';
    }

    const hashedPassword = await bcrypt.hash(password, 7);

    console.log(email, nickName, hashedPassword);

    const user = await prisma.user.create({
      data: {
        email,
        nickName,
        password: hashedPassword,
      },
    });

    const token = createToken(user);

    return { token, user };
  }

  public async validateLogin (email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return 'Incorrect email/password';
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return 'Incorrect email/password';
    }

    const token = createToken(user);

    return { token, user };
  }

  public async getUser (token: string) {
    const userId = verifyToken(token);

    if (!userId) {
      return 'Not authorized';
    }
    return prisma.user.findUnique({
      where: {
      // @ts-ignore
        id: userId.userId,
      },
    });
  }

  public async updateUserData (userId: string, email?: string, password?: string, nickName?: string) {
    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    const existingUserByNickname = await prisma.user.findUnique({
      where: {
        nickName,
      },
    });

    const updatingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (existingUserByEmail || existingUserByNickname) {
      return 'User with provided email or nickname already exists';
    }

    const hashedPassword = password ? await bcrypt.hash(password, 7) : null;

    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: email || updatingUser.email,
        nickName: nickName || updatingUser.nickName,
        password: hashedPassword || updatingUser.password,
      },
    });
  }

  public async deleteUser (userId: string) {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return 'User with privided id does not exist';
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return 'Deleted successfully';
  }
}

export default UserAPI;
