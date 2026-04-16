export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
}

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  AWAY = 'AWAY',
  UNDER_CARE = 'UNDER_CARE',
}

export class Member {
  id: string;
  churchId: string;
  fullName: string;
  email?: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  maritalStatus: MaritalStatus;
  address?: string;
  membershipDate: Date;
  baptismDate?: Date;
  status: MemberStatus;
  ministry?: string;
  notes?: string;
  smallGroupId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<Member>) {
    Object.assign(this, partial);
  }
}
