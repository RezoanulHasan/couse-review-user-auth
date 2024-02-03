/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import notFound from './app/middlewares/notFound';
import courseRoutes from './app/routes/course.routes';
import categoryRoutes from './app/routes/category.routes';
import reviewRoutes from './app/routes/review.routes';
import authRoutes from './app/routes/authRoutes';
import cookieParser from 'cookie-parser';
import globalErrorMainHandler from './app/middlewares/globalErrorMainHandler';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
//  authentication routes
app.use('/api/auth', authRoutes);
//other route
app.use(courseRoutes);
app.use(categoryRoutes);
app.use(reviewRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'sever is running' });
});
// Global error handler
app.use(globalErrorMainHandler);
//Not Found handler
app.use(notFound);

export default app;
