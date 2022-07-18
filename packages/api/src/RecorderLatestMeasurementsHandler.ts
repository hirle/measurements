import { NextFunction } from "express";
import { Request, Response } from 'express-serve-static-core';

import Recorder from "./recorders/Recorder";

export default class RecorderLatestMeasurementsHandler {
  constructor( readonly recorder: Recorder ){}

  private handleRequest(req: Request, res: Response, next: NextFunction) {
    const effectiveCount = req.params.count ? parseInt(req.params.count, 10) : 1;

    return this.recorder.database.getLatestMeasurements(this.recorder.measurementSupplier, effectiveCount)
      .then(values => {
        res.send(values);
      })
      .catch(err => {
        next(err);
      });
  }

  static create(recorder: Recorder): (req: Request, res: Response, next: NextFunction) => void {
      const returned = new RecorderLatestMeasurementsHandler( recorder );
      return returned.handleRequest.bind(returned);
  }

}