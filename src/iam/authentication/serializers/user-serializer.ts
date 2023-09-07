import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { IActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

export class UserSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error, user: IActiveUserData) => void) {
    done(null, {
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async deserializeUser(
    payload: IActiveUserData,
    done: (err: Error, user: IActiveUserData) => void,
  ) {
    done(null, payload);
  }
}
