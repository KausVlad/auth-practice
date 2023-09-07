import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Auth } from '../decorators/auth.decorator';
import { EnumAuthType } from '../enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';

@Auth(EnumAuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('signUp')
  singUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refreshTokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('signIn')
  // async signIn(
  //   @Res({ passthrough: true }) response: Response,
  //   @Body() signInDto: SignUpDto,
  // ) {
  //   const accessToken = await this.authService.signIn(signInDto);
  //   console.log(accessToken);
  //   response.cookie('accessToken', accessToken, {
  //     // secure: true,
  //     httpOnly: true,
  //     sameSite: true,
  //   });
  // }
}
