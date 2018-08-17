import * as express from 'express';
import * as bodyParser from 'body-parser';
import { connect } from 'mongoose';
import { booksRouter } from './routes';
import { HttpException } from './shared/httpException';
import { config } from './config';

const app: express.Application = express();

connect(config.mongodb, { useNewUrlParser: true });
console.log('Database connected');

app.use(bodyParser.json());

app.use('/api/books', booksRouter);

app.use((exception: HttpException | Error, req, res, next) => {
    if (exception instanceof HttpException) {
        res.status(exception.getStatus()).send(exception.message);
    } else {
        console.error(exception.message);
        res.status(500).send('internal server error');
    }
});

const server = app.listen('3000', () => {
    console.log('server listening on PORT 3000');
});

module.exports = server;



