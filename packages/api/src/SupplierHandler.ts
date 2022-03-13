import { NextFunction } from 'express';
import { Request, Response } from 'express-serve-static-core';
import Supplier from './Supplier';

export default class SupplierHandler<T> {

    private supplier: Supplier<T>;

    constructor( supplier:Supplier<T> ) {
        this.supplier = supplier;
    }

    private handleRequest(req: Request, res: Response, _: NextFunction) {
        const returned = this.supplier.get();
        res.send(returned);
    }

    static create<T>(supplier : Supplier<T>): (req: Request, res: Response, next: NextFunction) => void {
        const returned = new SupplierHandler( supplier );
        return returned.handleRequest.bind(returned);
    }
}