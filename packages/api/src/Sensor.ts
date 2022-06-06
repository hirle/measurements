import { Measurement } from "./Measurement";
import ObjectWithId, { ObjectWithIdCollection } from "./patterns/ObjectWithID";


export abstract class Sensor implements ObjectWithId{
  public readonly id: string;

  protected constructor( id:string ) {
    this.id = id;
  }

  public abstract fetchValue(): Promise<SensorValues>;
  public abstract getValuesKeys(): Readonly<Set<string>>;
}


export interface SensorValues {
  values: Map<string, Measurement>
} 


export class SensorCollection extends ObjectWithIdCollection<Sensor> {
}
