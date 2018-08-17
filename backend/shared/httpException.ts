import { HTTP_STATUS } from './status.enum';

export class HttpException extends Error {
    private status;
    constructor(message: string, _status: HTTP_STATUS) {
        super(message);
        this.status = _status;
    }

    public getStatus(){
        return this.status;
    }
}