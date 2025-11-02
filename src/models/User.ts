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
  password: { type: String, required: true, select: false }, // select: false prevents password from being returned in queries by default
}, { timestamps: true });


// When fetching a user, we need to explicitly ask for the password if needed (e.g., for login verification)
UserSchema.pre('findOne', function (next) {
  const { email } = this.getQuery();
  if (email) {
    this.select('+password');
  }
  next();
});


export default models.User || model<IUser>('User', UserSchema);
