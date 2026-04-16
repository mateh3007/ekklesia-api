import { Module } from '@nestjs/common';
import { MemberRepository } from './domain/member.repository.js';
import { MemberFollowUpRepository } from './domain/member-follow-up.repository.js';
import { PrismaMemberRepository } from './infrastructure/prisma-member.repository.js';
import { PrismaMemberFollowUpRepository } from './infrastructure/prisma-member-follow-up.repository.js';
import { SmallGroupRepository } from '../small-groups/domain/small-group.repository.js';
import { PrismaSmallGroupRepository } from '../small-groups/infrastructure/prisma-small-group.repository.js';
import { CreateMemberUseCase } from './application/create-member/create-member.usecase.js';
import { FindMemberByIdUseCase } from './application/find-member-by-id/find-member-by-id.usecase.js';
import { ListMembersUseCase } from './application/list-members/list-members.usecase.js';
import { UpdateMemberUseCase } from './application/update-member/update-member.usecase.js';
import { DeleteMemberUseCase } from './application/delete-member/delete-member.usecase.js';
import { AssignSmallGroupUseCase } from './application/assign-small-group/assign-small-group.usecase.js';
import { CreateFollowUpUseCase } from './application/create-follow-up/create-follow-up.usecase.js';
import { FindFollowUpByIdUseCase } from './application/find-follow-up-by-id/find-follow-up-by-id.usecase.js';
import { ListFollowUpsUseCase } from './application/list-follow-ups/list-follow-ups.usecase.js';
import { UpdateFollowUpUseCase } from './application/update-follow-up/update-follow-up.usecase.js';
import { DeleteFollowUpUseCase } from './application/delete-follow-up/delete-follow-up.usecase.js';
import { GetMembersDashboardUseCase } from './application/get-members-dashboard/get-members-dashboard.usecase.js';
import { CreateMemberController } from './presentation/create-member.controller.js';
import { FindMemberByIdController } from './presentation/find-member-by-id.controller.js';
import { ListMembersController } from './presentation/list-members.controller.js';
import { UpdateMemberController } from './presentation/update-member.controller.js';
import { DeleteMemberController } from './presentation/delete-member.controller.js';
import { AssignSmallGroupController } from './presentation/assign-small-group.controller.js';
import { CreateFollowUpController } from './presentation/create-follow-up.controller.js';
import { FindFollowUpByIdController } from './presentation/find-follow-up-by-id.controller.js';
import { ListFollowUpsController } from './presentation/list-follow-ups.controller.js';
import { UpdateFollowUpController } from './presentation/update-follow-up.controller.js';
import { DeleteFollowUpController } from './presentation/delete-follow-up.controller.js';
import { GetMembersDashboardController } from './presentation/get-members-dashboard.controller.js';
import { JwtAuthGuard } from '../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../shared/presentation/guards/permissions.guard.js';

@Module({
  controllers: [
    CreateMemberController,
    FindMemberByIdController,
    ListMembersController,
    UpdateMemberController,
    DeleteMemberController,
    AssignSmallGroupController,
    CreateFollowUpController,
    FindFollowUpByIdController,
    ListFollowUpsController,
    UpdateFollowUpController,
    DeleteFollowUpController,
    GetMembersDashboardController,
  ],
  providers: [
    CreateMemberUseCase,
    FindMemberByIdUseCase,
    ListMembersUseCase,
    UpdateMemberUseCase,
    DeleteMemberUseCase,
    AssignSmallGroupUseCase,
    CreateFollowUpUseCase,
    FindFollowUpByIdUseCase,
    ListFollowUpsUseCase,
    UpdateFollowUpUseCase,
    DeleteFollowUpUseCase,
    GetMembersDashboardUseCase,
    { provide: MemberRepository, useClass: PrismaMemberRepository },
    { provide: MemberFollowUpRepository, useClass: PrismaMemberFollowUpRepository },
    { provide: SmallGroupRepository, useClass: PrismaSmallGroupRepository },
    JwtAuthGuard,
    PermissionsGuard,
  ],
})
export class MembersModule {}
