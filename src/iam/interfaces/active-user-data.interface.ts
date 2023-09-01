import { EnumRole } from '@prisma/client';

export interface IActiveUserData {
  sub: number;
  email: string;
  role: EnumRole;
}
