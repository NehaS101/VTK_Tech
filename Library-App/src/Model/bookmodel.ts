import mongoose, { Document, Schema } from 'mongoose';

interface IBook extends Document {
  title: string;
  createdAt: Date;
}

const bookSchema = new Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;
