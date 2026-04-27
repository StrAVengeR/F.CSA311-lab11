import { Book, Member, Loan, Reservation } from './types';

export const books: Map<string, Book> = new Map();
export const members: Map<string, Member> = new Map();
export const loans: Map<string, Loan> = new Map();
export const reservations: Map<string, Reservation> = new Map();

// Туршилтын өгөгдөл
books.set('book_1', {
  id: 'book_1',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  isbn: '978-0132350884',
  available: true
});

books.set('book_2', {
  id: 'book_2',
  title: 'The Pragmatic Programmer',
  author: 'Andrew Hunt',
  isbn: '978-0201616224',
  available: true
});

members.set('member_1', {
  id: 'member_1',
  name: 'Bat-Erdene',
  email: 'bat@example.com',
  joinedAt: new Date()
});