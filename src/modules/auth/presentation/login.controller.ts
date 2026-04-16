import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { LoginUseCase } from '../application/login/login.usecase.js';
import { LoginDto } from '../application/login/login.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuário e obter token JWT' })
  @ApiOkResponse({ description: 'Token gerado com sucesso', schema: { properties: { accessToken: { type: 'string' } } } })
  async handle(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}
