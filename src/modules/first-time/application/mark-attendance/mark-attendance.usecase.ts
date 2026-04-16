import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DayOfWeek } from '../../../church-worship/domain/church-worship.entity.js';
import { ChurchWorshipRepository } from '../../../church-worship/domain/church-worship.repository.js';
import { VisitorAttendance } from '../../domain/visitor-attendance.entity.js';
import { VisitorAttendanceRepository } from '../../domain/visitor-attendance.repository.js';
import { VisitorRepository } from '../../domain/visitor.repository.js';
import { MarkAttendanceDto } from './mark-attendance.dto.js';

const JS_DAY_TO_ENUM: Record<number, DayOfWeek> = {
  0: DayOfWeek.SUNDAY,
  1: DayOfWeek.MONDAY,
  2: DayOfWeek.TUESDAY,
  3: DayOfWeek.WEDNESDAY,
  4: DayOfWeek.THURSDAY,
  5: DayOfWeek.FRIDAY,
  6: DayOfWeek.SATURDAY,
};

const DAY_LABEL: Record<DayOfWeek, string> = {
  [DayOfWeek.SUNDAY]: 'domingo',
  [DayOfWeek.MONDAY]: 'segunda-feira',
  [DayOfWeek.TUESDAY]: 'terça-feira',
  [DayOfWeek.WEDNESDAY]: 'quarta-feira',
  [DayOfWeek.THURSDAY]: 'quinta-feira',
  [DayOfWeek.FRIDAY]: 'sexta-feira',
  [DayOfWeek.SATURDAY]: 'sábado',
};

@Injectable()
export class MarkAttendanceUseCase {
  constructor(
    private readonly visitorRepository: VisitorRepository,
    private readonly attendanceRepository: VisitorAttendanceRepository,
    private readonly worshipRepository: ChurchWorshipRepository,
  ) {}

  async execute(
    churchId: string,
    visitorId: string,
    dto: MarkAttendanceDto,
  ): Promise<VisitorAttendance> {
    // Normalizar para meia-noite UTC
    const attendedAt = new Date(dto.attendedAt);
    attendedAt.setUTCHours(0, 0, 0, 0);

    // Regra 1: não pode ser data futura
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (attendedAt > today) {
      throw new BadRequestException('A data de presença não pode ser uma data futura.');
    }

    // Regra 2: visitante existe e pertence à igreja
    const visitor = await this.visitorRepository.findById(visitorId);
    if (!visitor) {
      throw new NotFoundException(`Visitante com ID "${visitorId}" não encontrado.`);
    }
    if (visitor.churchId !== churchId) {
      throw new ForbiddenException('Visitante não pertence a esta igreja.');
    }

    // Regra 3: culto existe e pertence à igreja
    const worship = await this.worshipRepository.findById(dto.worshipId);
    if (!worship) {
      throw new NotFoundException(`Culto com ID "${dto.worshipId}" não encontrado.`);
    }
    if (worship.churchId !== churchId) {
      throw new ForbiddenException('Culto não pertence a esta igreja.');
    }

    // Regra 4: dia da semana deve bater com o culto
    const attendedDayEnum = JS_DAY_TO_ENUM[attendedAt.getUTCDay()];
    if (attendedDayEnum !== worship.dayOfWeek) {
      throw new BadRequestException(
        `Este culto ocorre toda ${DAY_LABEL[worship.dayOfWeek]}, mas a data informada é uma ${DAY_LABEL[attendedDayEnum]}.`,
      );
    }

    // Regra 5: sem duplicata no mesmo dia
    const alreadyMarked = await this.attendanceRepository.existsOnSameDay(visitorId, attendedAt);
    if (alreadyMarked) {
      throw new ConflictException('Presença já registrada para este visitante neste dia.');
    }

    const attendance = new VisitorAttendance({
      visitorId,
      worshipId: dto.worshipId,
      churchId,
      attendedAt,
    });

    return this.attendanceRepository.create(attendance);
  }
}
