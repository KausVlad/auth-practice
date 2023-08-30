import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('singUp')
  singUp(@Body() signUpDto: SignUpDto) {
    return this.authService.singUp(signUpDto);
  }

  @Post('signIn')
  signIn(@Body() signInDto: SignUpDto) {
    return this.authService.signIn(signInDto);
  }
}
