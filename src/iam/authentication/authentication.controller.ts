import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Response } from 'express';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('signUp')
  singUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignUpDto,
  ) {
    const accessToken = await this.authService.signIn(signInDto);
    console.log(accessToken);
    response.cookie('accessToken', accessToken, {
      // secure: true,
      httpOnly: true,
      sameSite: true,
    });
  }
}
