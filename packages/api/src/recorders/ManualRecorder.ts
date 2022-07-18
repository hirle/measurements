import { Measurement, MeasurementSupplier } from '../Measurement';
import MeasurementsDatabase from '../MeasurementsDatabase';
import Supplier from '../patterns/Supplier';
import Recorder from './Recorder';

export default class ManualRecorder extends Recorder implements Supplier<Promise<Measurement>> {

  public constructor( id:string, measurementSupplier: MeasurementSupplier, database: MeasurementsDatabase ) {
    super(id, measurementSupplier, database);
  }

  public recordOneMeasurement(): Promise<Measurement> {
    return this.measurementSupplier.get()
    .then( (measurement: Measurement) => {
      this.database.record(measurement);
      return measurement;
    });
  }

  public get(): Promise<Measurement> {
    return this.recordOneMeasurement();
  }
}