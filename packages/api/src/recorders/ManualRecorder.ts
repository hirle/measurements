import { Measurement, MeasurementSupplier } from '../Measurement';
import MeasurementsDatabase from '../MeasurementsDatabase';
import Supplier from '../patterns/Supplier';
import Recorder from './Recorder';
import { getLogger as Log4jsGetLogger } from 'log4js';

export default class ManualRecorder extends Recorder implements Supplier<Promise<Measurement>> {

  private appLogger;

  public constructor( id:string, measurementSupplier: MeasurementSupplier, database: MeasurementsDatabase ) {
    super(id, measurementSupplier, database);
    this.appLogger = Log4jsGetLogger('app')
  }

  public recordOneMeasurement(): Promise<Measurement> {
    return this.measurementSupplier.get()
      .then( (measurement: Measurement) => {
        return this.database.record(measurement)
          .then( () => { 
            this.appLogger.info( `Measurement ${measurement.getSupplier().id} ${measurement.getSupplier().key} recorded`);
              return Promise.resolve(measurement)
          });
      });
  }

  public get(): Promise<Measurement> {
    return this.recordOneMeasurement();
  }
}