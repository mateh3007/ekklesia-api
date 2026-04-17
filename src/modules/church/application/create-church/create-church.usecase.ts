import { Injectable, ConflictException } from '@nestjs/common';
import { ChurchRepository } from '../../domain/church.repository.js';
import { Church } from '../../domain/church.entity.js';
import { CreateChurchDto } from './create-church.dto.js';
import { ChurchPermissionRepository } from '../../../church-permissions/domain/church-permission.repository.js';

@Injectable()
export class CreateChurchUseCase {
  constructor(
    private readonly churchRepository: ChurchRepository,
    private readonly churchPermissionRepository: ChurchPermissionRepository,
  ) {}

  async execute(dto: CreateChurchDto): Promise<Church> {
    const [existingDocument, existingEmail] = await Promise.all([
      this.churchRepository.findByDocument(dto.document),
      this.churchRepository.findByEmail(dto.email),
    ]);

    if (existingDocument) {
      throw new ConflictException('Já existe uma igreja com este CNPJ.');
    }

    if (existingEmail) {
      throw new ConflictException('Já existe uma igreja com este e-mail.');
    }

    const church = new Church({
      name: dto.name,
      document: dto.document,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      isActive: true,
    });

    const created = await this.churchRepository.create(church);
    await this.churchPermissionRepository.grantByPermissionName(created.id, 'church');
    return created;
  }
}
