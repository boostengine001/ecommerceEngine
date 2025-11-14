
import mongoose, { Schema, Document, models, model } from 'mongoose';
import { IRole } from './Role';

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  avatar?: string;
  role: mongoose.Types.ObjectId | IRole;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: [true, 'First name is required.'], trim: true },
  lastName: { type: String, required: [true, 'Last name is required.'], trim: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  password: { type: String, required: false, select: false }, 
  avatar: { type: String },
  role: { type: Schema.Types.ObjectId, ref: 'Role', required: false },
  googleId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

UserSchema.pre('save', function(next) {
    if (!this.password && !this.googleId) {
        next(new Error('A password is required if not signing up with Google.'));
    } else {
        next();
    }
});


export default models.User || model<IUser>('User', UserSchema);
