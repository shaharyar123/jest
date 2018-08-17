import { Router } from 'express';
import { createBook, deleteBook } from '../services/books.service';
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

router.delete('/:id', async (req, res, next) => {
    try {
        await deleteBook(req.params.id);
        res.status(HTTP_STATUS.SUCCESS).send('true');
    } catch (exception) {
        next(exception);
    }
})

export const booksRouter = router;