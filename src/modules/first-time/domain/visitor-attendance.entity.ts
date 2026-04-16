export class VisitorAttendance {
  id: string;
  visitorId: string;
  worshipId: string;
  churchId: string;
  attendedAt: Date;
  createdAt: Date;

  constructor(partial: Partial<VisitorAttendance>) {
    Object.assign(this, partial);
  }
}
