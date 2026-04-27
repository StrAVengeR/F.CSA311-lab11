import { Router, Request, Response, NextFunction } from 'express';
import { reservations, books, members } from '../db';
import { Reservation } from '../types';
import { createError } from '../middleware/errorHandler';

const router = Router();
const generateId = () => 'res_' + Date.now() + Math.random().toString(36).substr(2, 5);

router.get('/', (req: Request, res: Response) => {
  res.status(200).json(Array.from(reservations.values()));
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const { bookId, memberId } = req.body;
  if (!bookId || !memberId) {
    return next(createError(400, 'Bad Request', 'bookId and memberId are required'));
  }

  if (!books.has(bookId)) return next(createError(404, 'Not Found', `Book ${bookId} not found`));
  if (!members.has(memberId)) return next(createError(404, 'Not Found', `Member ${memberId} not found`));

  const reservation: Reservation = {
    id: generateId(),
    bookId,
    memberId,
    reservedAt: new Date()
  };

  reservations.set(reservation.id, reservation);
  res.status(201).json(reservation);
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  if (!reservations.has(req.params.id)) {
    return next(createError(404, 'Not Found', `Reservation ${req.params.id} not found`));
  }
  reservations.delete(req.params.id);
  res.status(204).send();
});

export default router;