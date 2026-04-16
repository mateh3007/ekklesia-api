import { User } from './user.entity.js';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract update(id: string, data: Partial<User>): Promise<User>;
  abstract softDelete(id: string): Promise<void>;
  abstract findAllByChurchId(churchId: string): Promise<User[]>;
}
