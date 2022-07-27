import { NextFunction } from "express";
import { Request, Response } from 'express-serve-static-core';

export type Runnable =  () => void;

export default class RunnableHandler {
  
  constructor( private runnable: Runnable ) {}

  private handleRequest(_req: Request, res: Response, _next: NextFunction) {
    this.runnable();
    res.send();
  }


  static create ( runnable: Runnable ): (req: Request, res: Response, next: NextFunction) => void {
    const returned = new RunnableHandler( runnable );
    return returned.handleRequest.bind(returned);
  } 
}