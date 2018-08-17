import * as app from '..';
import * as request from 'supertest';
import { HTTP_STATUS } from '../shared/status.enum';
import { Book } from '../interfaces/book.interface';
import { BookModel } from '../models/book.model';
import { disconnect } from "mongoose";

const book: Book = {
    name: "Harry Potter",
    author: "JK Rowling",
    IBAN: "12i37198237"
}

const invalidBook1: Book = {
    name: null,
    author: "JK Rowling",
    IBAN: "12i37198237"
}

const invalidBook2: Book = {
    name: "Harry Potter",
    author: null,
    IBAN: "12i37198237"
}

const invalidBook3: Book = {
    name: "Harry Potter",
    author: "JK Rowling",
    IBAN: null
}

describe('Books Module API Tests', async () => {

    describe('POST /api/books', async () => {

        beforeEach(async () => {
            await BookModel.remove({});
        });

        it('should create a new book in database', async (done) => {

            await request(app)
                .post('/api/books')
                .send(book)
                .expect(HTTP_STATUS.CREATED);

            const result = await BookModel.find({});
            expect(result.length).toBe(1);
            expect(result[0].name).toEqual(book.name);
            done();

        });

        it('should return 400 when book name is missing', async (done) => {

            await request(app)
                .post('/api/books')
                .send(invalidBook1)
                .expect(HTTP_STATUS.BAD_REQUEST);
            done();

        });

        it('should return 400 when author name is missing', async (done) => {

            await request(app)
                .post('/api/books')
                .send(invalidBook2)
                .expect(HTTP_STATUS.BAD_REQUEST);
            done();
        });

        it('should return 400 when IBAN name is missing', async (done) => {

            await request(app)
                .post('/api/books')
                .send(invalidBook3)
                .expect(HTTP_STATUS.BAD_REQUEST);
            done();
        });

        it('should return 409 on duplicate record', async (done) => {

            await new BookModel(book).save();

            await request(app)
                .post('/api/books')
                .send(book)
                .expect(HTTP_STATUS.CONFLICT);

            done();
        });

        afterAll(async (done) => {
            await BookModel.remove({});
            await disconnect();
            done();
        });

    });

});