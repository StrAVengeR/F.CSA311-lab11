import { Router, Request, Response, NextFunction } from 'express';
import { members } from '../db';
import { Member } from '../types';
import { createError } from '../middleware/errorHandler';

const router = Router();
const generateId = () => 'member_' + Date.now() + Math.random().toString(36).substr(2, 5);

router.get('/', (req: Request, res: Response) => {
  res.status(200).json(Array.from(members.values()));
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const member = members.get(req.params.id);
  if (!member) return next(createError(404, 'Not Found', `Member ${req.params.id} not found`));
  res.status(200).json(member);
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.body;
  if (!name || !email) return next(createError(400, 'Bad Request', 'name and email are required'));

  const member: Member = {
    id: generateId(),
    name,
    email,
    joinedAt: new Date()
  };
  members.set(member.id, member);
  res.status(201).json(member);
});

router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  const member = members.get(req.params.id);
  if (!member) return next(createError(404, 'Not Found', `Member ${req.params.id} not found`));
  const { name, email } = req.body;
  if (name) member.name = name;
  if (email) member.email = email;
  res.status(200).json(member);
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  if (!members.has(req.params.id)) return next(createError(404, 'Not Found', `Member ${req.params.id} not found`));
  members.delete(req.params.id);
  res.status(204).send();
});

export default router;