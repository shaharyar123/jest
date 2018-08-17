import { Book } from '../interfaces/book.interface';
import { BookModel } from '../models/book.model';
import { HttpException } from '../shared/httpException';
import { HTTP_STATUS } from '../shared/status.enum';
import { Types } from 'mongoose';

export async function createBook(book: Book): Promise<Book> {
    validateBook(book);
    await checkDuplicate(book);
    await new BookModel(book).save();
    return book;
}

export async function deleteBook(id): Promise<Boolean> {
    await ensureExistance(id);
    await BookModel.remove({_id: id});
    return true;
}

export async function findByName(name: String): Promise<Book> {
    return await BookModel.findOne({ name: name });
    
}

export function validateBook(book: Book): Boolean {
    if (!book.name) {
        throw new HttpException('name is required', HTTP_STATUS.BAD_REQUEST);
    }
    if (!book.IBAN) {
        throw new HttpException('IBAN is required', HTTP_STATUS.BAD_REQUEST);
    }
    if (!book.author) {
        throw new HttpException('author is required', HTTP_STATUS.BAD_REQUEST);
    }
    return true;
}

export async function checkDuplicate(book: Book): Promise<Boolean> {
    const duplicate = await findByName(book.name);
    if (duplicate) {
        throw new HttpException('book already exist', HTTP_STATUS.CONFLICT);
    }
    return false;
}

export async function ensureExistance(id): Promise<Book> {
    console.log(id);
    const book = await BookModel.findById(id);
    console.log(book);
    if(!book){
        throw new HttpException('book not found', HTTP_STATUS.NOT_FOUND);
    }
    return book;
}