
import mongoose, { Schema, Document, models, model } from 'mongoose';
import { IRole } from './Role';

export interface IAddress extends Document {
  _id: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  password?: string;
  avatar?: string;
  role?: mongoose.Types.ObjectId | IRole;
  googleId?: string;
  isGuest?: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  phoneOtp?: string;
  phoneOtpExpires?: Date;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: false, trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, unique: true, sparse: true, trim: true },
  password: { type: String, required: false, select: false }, 
  avatar: { type: String },
  role: { type: Schema.Types.ObjectId, ref: 'Role', required: false },
  googleId: { type: String, unique: true, sparse: true },
  isGuest: { type: Boolean, default: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  phoneOtp: { type: String, select: false },
  phoneOtpExpires: { type: Date, select: false },
  addresses: [AddressSchema],
}, { timestamps: true });

UserSchema.pre('save', function(next) {
    if (!this.password && !this.googleId && !this.phone && !this.isGuest) {
        return next(new Error('Authentication method (password, google, or phone) is required.'));
    }
    
    // Ensure there is only one default address
    if (this.isModified('addresses')) {
        const defaultAddresses = this.addresses.filter(addr => addr.isDefault);
        if (defaultAddresses.length > 1) {
            return next(new Error('Only one address can be set as default.'));
        }
        if (defaultAddresses.length === 0 && this.addresses.length > 0) {
            this.addresses[0].isDefault = true;
        }
    }
    
    next();
});

export default models.User || model<IUser>('User', UserSchema);
