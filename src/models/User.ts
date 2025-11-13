
import mongoose, { Schema, Document, models, model } from 'mongoose';
import { IRole } from './Role';

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: mongoose.Types.ObjectId | IRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: [true, 'First name is required.'], trim: true },
  lastName: { type: String, required: [true, 'Last name is required.'], trim: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false }, 
  role: { type: Schema.Types.ObjectId, ref: 'Role', required: false },
}, { timestamps: true });

export default models.User || model<IUser>('User', UserSchema);
