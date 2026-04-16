import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './shared/infrastructure/prisma/prisma.module.js';
import { GlobalJwtModule } from './shared/infrastructure/jwt/jwt.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ChurchModule } from './modules/church/church.module.js';
import { BranchChurchModule } from './modules/branch-church/branch-church.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { PermissionsModule } from './modules/permissions/permissions.module.js';
import { ChurchPermissionsModule } from './modules/church-permissions/church-permissions.module.js';
import { ChurchWorshipModule } from './modules/church-worship/church-worship.module.js';
import { FirstTimeModule } from './modules/first-time/first-time.module.js';
import { MembersModule } from './modules/members/members.module.js';
import { SmallGroupsModule } from './modules/small-groups/small-groups.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    GlobalJwtModule,
    AuthModule,
    ChurchModule,
    BranchChurchModule,
    UsersModule,
    PermissionsModule,
    ChurchPermissionsModule,
    ChurchWorshipModule,
    FirstTimeModule,
    MembersModule,
    SmallGroupsModule,
  ],
})
export class AppModule {}
