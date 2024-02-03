import mongoose, { Schema, Document, Types } from 'mongoose';
import { CourseSchema } from './validationSchemas';
import { UserModel } from './user.model';
export interface Course extends Document {
  title: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags: { name: string; isDeleted: boolean }[];
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  durationInWeeks?: number;
  details: {
    level: string;
    description: string;
  };
  createdBy?: Types.ObjectId;
  isDeleted?: boolean;
}

const courseSchema = new Schema<Course>(
  {
    title: { type: String, unique: true, required: true },
    instructor: { type: String, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    price: { type: Number, required: true },
    tags: [
      {
        name: { type: String, required: true },
        isDeleted: { type: Boolean, required: true },
      },
    ],
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    language: { type: String, required: true },
    provider: { type: String, required: true },
    durationInWeeks: { type: Number },
    details: {
      level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'PRO'],
        required: true,
      },
      description: { type: String, required: true },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming your user collection is named 'User'
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Add timestamps option here
  },
);
// Middleware to automatically set createdBy before saving
courseSchema.pre<Course>('save', async function (next) {
  try {
    if (!this.createdBy) {
      // If createdBy is not set, find and set the admin user
      const adminUser = await UserModel.findOne({ role: 'admin' }).exec();

      if (!adminUser) {
        throw new Error('Admin user not found.');
      }

      this.createdBy = adminUser._id;
    }

    next();
  } catch (error) {
    // Pass the error to the error handling middleware
    next();
  }
});
export const CourseModel = mongoose.model<Course>('Course', courseSchema);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateCourse = (data: Record<string, any>) =>
  CourseSchema.parse(data);
