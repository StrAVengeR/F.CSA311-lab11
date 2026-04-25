export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  isDeleted: boolean;
}

export interface CreateUserInput {
  email: string;
  name: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}