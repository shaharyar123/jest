import { Document, Schema, model } from 'mongoose';
import { Book } from '../interfaces/book.interface';


interface IBookModel extends Document, Book{

}

const bookSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    IBAN: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required :true
    }
});

export const BookModel = model<IBookModel>('book', bookSchema);


