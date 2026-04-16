import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service.js';
import { RegisterDto } from './register.dto.js';

export interface RegisterResponse {
  church: {
    id: string;
    name: string;
    document: string;
    email: string;
    phone: string | null;
    address: string | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RegisterDto): Promise<RegisterResponse> {
    // Verificar duplicatas antes de abrir a transação
    const [existingChurchDoc, existingChurchEmail, existingUser] = await Promise.all([
      this.prisma.church.findUnique({ where: { document: dto.document } }),
      this.prisma.church.findUnique({ where: { email: dto.churchEmail } }),
      this.prisma.user.findUnique({ where: { email: dto.adminEmail } }),
    ]);

    if (existingChurchDoc) {
      throw new ConflictException('Já existe uma igreja cadastrada com este documento.');
    }
    if (existingChurchEmail) {
      throw new ConflictException('Já existe uma igreja cadastrada com este e-mail.');
    }
    if (existingUser) {
      throw new ConflictException('Já existe um usuário cadastrado com este e-mail.');
    }

    const hashedPassword = await bcrypt.hash(dto.adminPassword, 10);

    const { church, user } = await this.prisma.$transaction(async (tx) => {
      // 1. Criar a igreja
      const church = await tx.church.create({
        data: {
          name: dto.churchName,
          document: dto.document,
          email: dto.churchEmail,
          phone: dto.phone ?? null,
          address: dto.address ?? null,
          isActive: true,
        },
      });

      // 2. Criar o usuário administrador
      const user = await tx.user.create({
        data: {
          churchId: church.id,
          name: dto.adminName,
          email: dto.adminEmail,
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          isActive: true,
        },
      });

      // 3. Buscar todas as permissões existentes
      const permissions = await tx.permission.findMany();

      // 4. Conceder todas as permissões à igreja
      if (permissions.length > 0) {
        await tx.churchPermission.createMany({
          data: permissions.map((p) => ({
            churchId: church.id,
            permissionId: p.id,
            isActive: true,
          })),
        });
      }

      return { church, user };
    });

    // 5. Gerar JWT
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      churchId: church.id,
      role: user.role,
      email: user.email,
    });

    return {
      church: {
        id: church.id,
        name: church.name,
        document: church.document,
        email: church.email,
        phone: church.phone,
        address: church.address,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    };
  }
}
