import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EnumAuthType } from '../enums/auth-type.enum';
import { Auth } from '../decorators/auth.decorator';
import { SessionAuthenticationService } from './session-authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { Request } from 'express';
import { promisify } from 'util';
import { SessionGuard } from './guard/session.guard';
import { ActiveUser } from '../decorators/active-user.decorator';
import { IActiveUserData } from '../interfaces/active-user-data.interface';

@Auth(EnumAuthType.None)
@Controller('session-authentication')
export class SessionAuthenticationController {
  constructor(
    private readonly sessionAuthenticationService: SessionAuthenticationService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  async signIn(@Req() req: Request, @Body() signInDto: SignInDto) {
    const user = await this.sessionAuthenticationService.signIn(signInDto);
    await promisify(req.login).call(req, user);
  }

  @UseGuards(SessionGuard)
  @Get()
  async me(@ActiveUser() user: IActiveUserData) {
    return `hi ${user.email}`;
  }
}
