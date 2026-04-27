import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import booksRouter from './routes/books';
import membersRouter from './routes/members';
import loansRouter from './routes/loans';
import reservationsRouter from './routes/reservations';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/books', booksRouter);
app.use('/members', membersRouter);
app.use('/loans', loansRouter);
app.use('/reservations', reservationsRouter);

app.use(errorHandler as any);

app.listen(PORT, () => {
  console.log(`Library API running on http://localhost:${PORT}`);
});

export default app;