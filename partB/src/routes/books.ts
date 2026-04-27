import { Router, Request, Response, NextFunction } from 'express';
import { books } from '../db';
import { Book } from '../types';
import { createError } from '../middleware/errorHandler';

const router = Router();

const generateId = () => 'book_' + Date.now() + Math.random().toString(36).substr(2, 5);

// GET /books — бүх номын жагсаалт
router.get('/', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const author = req.query.author as string;

  let result = Array.from(books.values());

  if (author) {
    result = result.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
  }

  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + limit);

  res.status(200).json({
    data: paginated,
    total: result.length,
    page,
    limit
  });
});

// GET /books/:id — нэг ном авах
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const book = books.get(req.params.id);
  if (!book) {
    return next(createError(404, 'Not Found', `Book ${req.params.id} not found`));
  }
  res.status(200).json(book);
});

// POST /books — шинэ ном нэмэх
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const { title, author, isbn } = req.body;

  if (!title || !author || !isbn) {
    return next(createError(400, 'Bad Request', 'title, author, isbn are required'));
  }

  const book: Book = {
    id: generateId(),
    title,
    author,
    isbn,
    available: true
  };

  books.set(book.id, book);
  res.status(201).json(book);
});

// PUT /books/:id — ном шинэчлэх
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  const book = books.get(req.params.id);
  if (!book) {
    return next(createError(404, 'Not Found', `Book ${req.params.id} not found`));
  }

  const { title, author, isbn } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;
  if (isbn) book.isbn = isbn;

  res.status(200).json(book);
});

// DELETE /books/:id — ном устгах
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  if (!books.has(req.params.id)) {
    return next(createError(404, 'Not Found', `Book ${req.params.id} not found`));
  }
  books.delete(req.params.id);
  res.status(204).send();
});

export default router;