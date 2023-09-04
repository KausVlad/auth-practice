import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ApiKeysService } from '../../api-keys.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { IActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeysService: ApiKeysService,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = this.extractKeyFromHeader(request);
    if (!key) {
      throw new UnauthorizedException();
    }
    const apiKeyEntityId = this.apiKeysService.extractIdFromApiKey(key);
    try {
      const apiKeyEntity = await this.prismaService.apiKey.findFirst({
        where: {
          uuid: apiKeyEntityId,
        },
        include: {
          user: true,
        },
      });
      await this.apiKeysService.validate(key, apiKeyEntity.key);
      request[REQUEST_USER_KEY] = {
        sub: apiKeyEntity.user.id,
        email: apiKeyEntity.user.email,
        role: apiKeyEntity.user.role,
      } as IActiveUserData;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractKeyFromHeader(request: Request): string | undefined {
    const [type, key] = request?.headers?.authorization?.split(' ') ?? [];
    return type === 'ApiKey' ? key : undefined;
  }
}
