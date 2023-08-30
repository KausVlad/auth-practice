import { SetMetadata } from '@nestjs/common';
import { EnumAuthType } from '../enums/auth-type.enum';

export const AUTH_TYPE_KEY = 'authType';

export const Auth = (...authTypes: EnumAuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
