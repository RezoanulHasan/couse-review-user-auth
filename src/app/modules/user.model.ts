import mongoose, { Schema, Document } from 'mongoose';
import { UserSchema as ValidationUserSchema } from './validationSchemas';

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  role: 'user' | 'admin';
  passwordChangeHistory: { password: string; timestamp: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    passwordChangeHistory: [
      {
        password: { type: String, required: true },
        timestamp: { type: Date, required: true },
      },
    ],
  },
  {
    timestamps: true, // Add timestamps option as an object
  },
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateUser = (data: Record<string, any>) =>
  ValidationUserSchema.parse(data);
