import { SignUpDto } from './dto/sign-up.dto';
import {
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { IActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp({ email, password }: SignUpDto) {
    const uniqueUserCheck = await this.prisma.user.count({
      where: {
        email,
      },
    });

    if (uniqueUserCheck) {
      throw new HttpException('User already exists', 409);
    }

    const hashedPassword = await this.hashingService.hash(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        hashedPassword: hashedPassword,
      },
    });

    return user;
  }

  async signIn({ email, password }: SignInDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const isPasswordValid = await this.hashingService.compare(
      password,
      user.hashedPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return await this.generateTokens(user);
  }

  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<IActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessExpiresIn,
        { email: user.email },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshExpiresIn),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<IActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.prisma.user.findFirstOrThrow({
        where: {
          id: sub,
        },
      });
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      },
    );
  }
}
