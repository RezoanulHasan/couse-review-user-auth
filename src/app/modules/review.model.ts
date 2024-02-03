/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import mongoose, { Schema, Document, Types } from 'mongoose';
import { ReviewSchema as ValidationReviewSchema } from './validationSchemas';
import { UserModel } from './user.model';

// Interface for the user data to be included in createdBy
interface UserData {
  _id: Types.ObjectId;
  username: string;
  email: string;
  role: string;
}

export interface Review extends Document {
  courseId: Types.ObjectId;
  rating: number;
  review: string;
  createdBy?: UserData;
  //createdBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema = new Schema<Review>(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    createdBy: {
      type: {}, // Use Schema.Types.ObjectId
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

ReviewSchema.pre<Review>('save', async function (next) {
  try {
    if (!this.createdBy) {
      const user = await UserModel.findOne({ role: 'user' }).exec();

      if (!user) {
        throw new Error('User not found.');
      }

      this.createdBy = user._id; // Set createdBy as the user's ObjectId
    }

    next();
  } catch (error) {
    // Pass the error to the error handling middleware
    next();
  }
});

export const ReviewModel = mongoose.model<Review>('Review', ReviewSchema);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateReview = (data: Record<string, any>) =>
  ValidationReviewSchema.parse(data);
