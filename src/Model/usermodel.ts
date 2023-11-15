// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
  roles: string[];
}

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: [String], default: ['VIEWER'] }, // Default role is 'VIEWER'
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
