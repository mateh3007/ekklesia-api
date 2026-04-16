import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterUseCase } from '../application/register/register.usecase.js';
import { RegisterDto } from '../application/register/register.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class RegisterController {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nova igreja e administrador' })
  async handle(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }
}
