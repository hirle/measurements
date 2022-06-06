import MeasurementDatabase from '../MeasurementDatabase';
import { MeasurementSupplier } from '../Measurement';
import { ObjectWithIdCollection } from '../patterns/ObjectWithID';

export default abstract class Recorder {

  public readonly id: string;
  public readonly measurementSupplier: MeasurementSupplier;
  public readonly database: MeasurementDatabase;

  protected constructor( id:string, measurementSupplier: MeasurementSupplier, database: MeasurementDatabase ) {
    this.id = id;
    this.measurementSupplier = measurementSupplier;
    this.database = database;
  }
}

export class RecorderCollection extends ObjectWithIdCollection<Recorder>{
}