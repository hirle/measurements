import { NextFunction } from 'express';
import { Request, Response } from 'express-serve-static-core';
import Supplier from './Supplier';

export default class PromiseSupplierHandler<T> {
  private supplier: Supplier<Promise<T>>;

  constructor(supplier: Supplier<Promise<T>>) {
    this.supplier = supplier;
  }

  private handleRequest(_req: Request, res: Response, next: NextFunction) {
   this.supplier.get()
      .then(value => {
        res.send(value);
      })
      .catch(err => {
        next(err);
      });
  }

  static create<T>(
    supplier: Supplier<Promise<T>>
  ): (req: Request, res: Response, next: NextFunction) => void {
    const returned = new PromiseSupplierHandler(supplier);
    return returned.handleRequest.bind(returned);
  }
}
