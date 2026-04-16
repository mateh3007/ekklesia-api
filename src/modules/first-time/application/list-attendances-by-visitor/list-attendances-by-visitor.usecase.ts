import { Injectable } from '@nestjs/common';
import { VisitorAttendanceRepository } from '../../domain/visitor-attendance.repository.js';
import { VisitorAttendance } from '../../domain/visitor-attendance.entity.js';

@Injectable()
export class ListAttendancesByVisitorUseCase {
  constructor(private readonly attendanceRepository: VisitorAttendanceRepository) {}

  async execute(visitorId: string): Promise<VisitorAttendance[]> {
    return this.attendanceRepository.findByVisitorId(visitorId);
  }
}
