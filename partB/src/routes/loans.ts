import { Router, Request, Response, NextFunction } from 'express';
import { loans, books, members } from '../db';
import { Loan } from '../types';
import { createError } from '../middleware/errorHandler';

const router = Router();
const generateId = () => 'loan_' + Date.now() + Math.random().toString(36).substr(2, 5);

// GET /loans
router.get('/', (req: Request, res: Response) => {
  res.status(200).json(Array.from(loans.values()));
});

// POST /loans — ном зээлэх
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const { bookId, memberId } = req.body;

  if (!bookId || !memberId) {
    return next(createError(400, 'Bad Request', 'bookId and memberId are required'));
  }

  const book = books.get(bookId);
  if (!book) return next(createError(404, 'Not Found', `Book ${bookId} not found`));

  const member = members.get(memberId);
  if (!member) return next(createError(404, 'Not Found', `Member ${memberId} not found`));

  if (!book.available) {
    return next(createError(409, 'Conflict', 'Book is not available'));
  }

  // Нэг гишүүн хамгийн ихдээ 5 ном зээлж болно
  const activeLoans = Array.from(loans.values()).filter(
    l => l.memberId === memberId && !l.returnedAt
  );
  if (activeLoans.length >= 5) {
    return next(createError(409, 'Conflict', 'Member has reached the loan limit of 5 books'));
  }

  const loan: Loan = {
    id: generateId(),
    bookId,
    memberId,
    loanDate: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 хоног
    renewed: false
  };

  book.available = false;
  loans.set(loan.id, loan);
  res.status(201).json(loan);
});

// PUT /loans/:id/return — ном буцаах
router.put('/:id/return', (req: Request, res: Response, next: NextFunction) => {
  const loan = loans.get(req.params.id);
  if (!loan) return next(createError(404, 'Not Found', `Loan ${req.params.id} not found`));

  if (loan.returnedAt) {
    return next(createError(409, 'Conflict', 'Book already returned'));
  }

  loan.returnedAt = new Date();
  const book = books.get(loan.bookId);
  if (book) book.available = true;

  res.status(200).json(loan);
});

// PUT /loans/:id/renew — зээл сунгах (нэг удаа)
router.put('/:id/renew', (req: Request, res: Response, next: NextFunction) => {
  const loan = loans.get(req.params.id);
  if (!loan) return next(createError(404, 'Not Found', `Loan ${req.params.id} not found`));

  if (loan.returnedAt) {
    return next(createError(409, 'Conflict', 'Cannot renew a returned loan'));
  }

  if (loan.renewed) {
    return next(createError(409, 'Conflict', 'Loan has already been renewed once'));
  }

  loan.dueDate = new Date(loan.dueDate.getTime() + 14 * 24 * 60 * 60 * 1000);
  loan.renewed = true;

  res.status(200).json(loan);
});

export default router;