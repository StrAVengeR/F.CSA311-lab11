import { User, CreateUserInput, UpdateUserInput } from './types';
import {
  UserNotFoundException,
  UserAlreadyExistsException,
  InvalidParameterException
} from './exceptions';

export class UserManager {
  private users: Map<string, User>;
  private emailIndex: Map<string, string>;

  constructor() {
    this.users = new Map();
    this.emailIndex = new Map();
  }

  public createUser(input: CreateUserInput): User {
    if (!input.email || !input.name) {
      throw new InvalidParameterException('Email and name are required');
    }
    if (this.emailIndex.has(input.email)) {
      throw new UserAlreadyExistsException(input.email);
    }
    const user: User = {
      id: 'user_' + Date.now() + Math.random().toString(36).substr(2, 9),
      email: input.email,
      name: input.name,
      createdAt: new Date(),
      isDeleted: false
    };
    this.users.set(user.id, user);
    this.emailIndex.set(user.email, user.id);
    return user;
  }

  public getUserById(userId: string): User {
    const user = this.users.get(userId);
    if (!user || user.isDeleted) throw new UserNotFoundException(userId);
    return user;
  }

  public getUserByEmail(email: string): User {
    const userId = this.emailIndex.get(email);
    if (!userId) throw new UserNotFoundException(email);
    return this.getUserById(userId);
  }

  public updateUser(userId: string, input: UpdateUserInput): User {
    const user = this.getUserById(userId);
    if (input.email && input.email !== user.email) {
      if (this.emailIndex.has(input.email)) {
        throw new UserAlreadyExistsException(input.email);
      }
      this.emailIndex.delete(user.email);
      this.emailIndex.set(input.email, user.id);
      user.email = input.email;
    }
    if (input.name) user.name = input.name;
    return user;
  }

  public deleteUser(userId: string): void {
    const user = this.getUserById(userId);
    user.isDeleted = true;
  }

  public restoreUser(userId: string): User {
    const user = this.users.get(userId);
    if (!user) throw new UserNotFoundException(userId);
    user.isDeleted = false;
    return user;
  }

  public searchUsers(query: string): User[] {
    const q = query.toLowerCase();
    return Array.from(this.users.values()).filter(
      u => !u.isDeleted && (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    );
  }
}