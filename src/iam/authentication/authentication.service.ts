import { SignUpDto } from './dto/sign-up.dto';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
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

    return user;
  }
}
