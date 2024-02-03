import mongoose, { Schema, Document, Types } from 'mongoose';
import { CategorySchema as ValidationCategorySchema } from './validationSchemas';
import { UserModel } from './user.model';

export interface Category extends Document {
  name: string;
  createdBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema = new Schema<Category>(
  {
    name: { type: String, unique: true, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming your user collection is named 'User'
    },
  },
  {
    timestamps: true, // Add timestamps option here
  },
);

// Middleware to automatically set createdBy before saving
CategorySchema.pre<Category>('save', async function (next) {
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

export const CategoryModel = mongoose.model<Category>(
  'Category',
  CategorySchema,
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateCategory = (data: Record<string, any>) =>
  ValidationCategorySchema.parse(data);
