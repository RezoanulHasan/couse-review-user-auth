import { z } from 'zod';

const detailsSchema = z.object({
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'PRO']),
  description: z.string().min(1),
});

export const CourseSchema = z.object({
  title: z.string(),
  instructor: z.string(),
  categoryId: z.string(),
  createdBy: z.string().optional(),
  price: z.number(),
  tags: z.array(
    z.object({
      name: z.string(),
      isDeleted: z.boolean(),
    }),
  ),
  startDate: z.string(),
  endDate: z.string(),
  language: z.string(),
  provider: z.string(),
  durationInWeeks: z.number().optional(),
  details: detailsSchema,
  isDeleted: z.boolean().optional(),
});

export const CategorySchema = z.object({
  name: z.string(),
  createdBy: z.string().optional(),
});

export const ReviewSchema = z.object({
  courseId: z.string().refine((val) => val.trim().length > 0, {
    message: 'Course ID is required',
  }),
  rating: z.number().refine((val) => val >= 1 && val <= 5, {
    message: 'Rating must be between 1 and 5',
  }),
  review: z.string().refine((val) => val.trim().length > 0, {
    message: 'Review is required',
  }),
  createdBy: z.string().optional(),
});

export const UserSchema = z.object({
  username: z.string().min(1).max(255),
  password: z.string().min(1),
  email: z.string().min(1),
});
