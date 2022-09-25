import bcrypt from 'bcrypt';
import prisma from '../prisma-client';

import { validatePassword } from '../utils';
import { createToken } from '../integrations/jwt/index';

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

    const hashedPassword = bcrypt.hash(password, 7);

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
}

export default UserAPI;
