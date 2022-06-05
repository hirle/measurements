import { Measurement, MeasurementSupplier } from '../Measurement';
import MeasurementDatabase from '../MeasurementDatabase';
import Recorder from './Recorder';

export default class ManualRecorder extends Recorder{

  public constructor( id:string, measurementSupplier: MeasurementSupplier, database: MeasurementDatabase ) {
    super(id, measurementSupplier, database);
  }

  public recordOneMeasurement(): Promise<void> {
    return this.measurementSupplier.get()
    .then( (measurement: Measurement) => this.database.record(measurement));
  }
}