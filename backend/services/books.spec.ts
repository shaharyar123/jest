import { Book } from "../interfaces/book.interface";
import { validateBook, createBook } from "./books.service";
import { HttpException } from "../shared/httpException";
import { HTTP_STATUS } from "../shared/status.enum";
import { checkDuplicate } from './books.service';
import { BookModel } from "../models/book.model";
import { connect, disconnect } from "mongoose";
import { AsyncResource } from "async_hooks";

const book: Book = {
    name: "Percy Jackson",
    author: "Jon Doe",
    IBAN: "12i37198237"
}

describe('Books Service Unit Tests', async () => {

    describe('ValidateBook Function', async () => {

        it('should validate return true on valid object', () => {

            expect(validateBook(book)).toBe(true);

        });

        it('should throw an exception when book name is missing', () => {
            const invalidBook = {
                name: null,
                author: "Jon Doe",
                IBAN: "12i37198237",
            }

            try {
                validateBook(invalidBook);
            } catch (err) {
                const exception: HttpException = err;
                expect(exception.getStatus()).toBe(HTTP_STATUS.BAD_REQUEST);
                expect(exception.message).toBe('name is required');
            }

        });

        it('should throw an exception when IBAN is missing', () => {
            const invalidBook = {
                name: "Percy Jackson",
                author: "Jon Doe",
                IBAN: null,
            }

            try {
                validateBook(invalidBook);
            } catch (err) {
                const exception: HttpException = err;
                expect(exception.getStatus()).toBe(HTTP_STATUS.BAD_REQUEST);
                expect(exception.message).toBe('IBAN is required');
            }

        });

        it('should throw an exception when author is missing', () => {
            const invalidBook = {
                name: "Percy Jackson",
                author: null,
                IBAN: "123129380129",
            }

            try {
                validateBook(invalidBook);
            } catch (err) {
                const exception: HttpException = err;
                expect(exception.getStatus()).toBe(HTTP_STATUS.BAD_REQUEST);
                expect(exception.message).toBe('author is required');
            }

        });

    });

    describe('checkDuplicate Function', async () => {

        it('should return false if the book is not a duplicate', async () => {

            jest.spyOn(BookModel, 'findOne').mockResolvedValueOnce(null);

            const result = await checkDuplicate(book);
            expect(result).toBe(false);

        });

        it('should throw an exception if the book is duplicate', async () => {

            jest.spyOn(BookModel, 'findOne').mockResolvedValueOnce({});

            const result = await checkDuplicate(book).catch((exception: HttpException) => {
                expect(exception.getStatus()).toBe(HTTP_STATUS.CONFLICT);
                expect(exception.message).toBe('book already exist');
            })

        });

    });
});

describe('Books Service Integration Tests', async () => {

    beforeAll(async () => {
        await connect('mongodb://localhost:27017/dev-ops-test', { useNewUrlParser: true });
    });

    beforeEach(async () => {
        await BookModel.remove({});
    });


    it('should create a new book in database', async () => {
        await createBook(book);
        const result = await BookModel.find({});
        expect(result.length).toBe(1);
        expect(result[0].name).toEqual(book.name);
    });

    afterAll(async () => {
        await disconnect();
    })


})