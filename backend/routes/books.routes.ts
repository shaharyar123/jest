import { Router } from 'express';
import { createBook } from '../services/books.service';
import { HttpException } from '../shared/httpException';
import { HTTP_STATUS } from '../shared/status.enum';

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const book = await createBook(req.body);
        res.statusCode = HTTP_STATUS.CREATED
        res.send(book)
    } catch (exception) {
        next(exception);
    }
});

export const booksRouter = router;