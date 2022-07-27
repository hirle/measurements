import MeasurementsDatabase from '../MeasurementsDatabase';
import { MeasurementSupplier } from '../Measurement';
import { ObjectWithIdCollection } from '../patterns/ObjectWithIdCollection';

export default abstract class Recorder {

  public readonly id: string;
  public readonly measurementSupplier: MeasurementSupplier;
  public readonly database: MeasurementsDatabase;

  protected constructor( id:string, measurementSupplier: MeasurementSupplier, database: MeasurementsDatabase ) {
    this.id = id;
    this.measurementSupplier = measurementSupplier;
    this.database = database;
  }
}

export class RecorderCollection extends ObjectWithIdCollection<Recorder>{
}