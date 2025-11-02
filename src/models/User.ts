
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: [true, 'First name is required.'], trim: true },
  lastName: { type: String, required: [true, 'Last name is required.'], trim: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: true }, 
}, { timestamps: true });

export default models.User || model<IUser>('User', UserSchema);
