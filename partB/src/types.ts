export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  joinedAt: Date;
}

export interface Loan {
  id: string;
  bookId: string;
  memberId: string;
  loanDate: Date;
  dueDate: Date;
  returnedAt?: Date;
  renewed: boolean;
}

export interface Reservation {
  id: string;
  bookId: string;
  memberId: string;
  reservedAt: Date;
}