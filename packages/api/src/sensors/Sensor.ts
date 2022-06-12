import { Measurement } from "../Measurement";
import ObjectWithId, { ObjectWithIdCollection } from "../patterns/ObjectWithID";
import { Unit } from "../Unit";
import { ValueType } from "../ValueType";


export abstract class Sensor implements ObjectWithId{
  public readonly id: string;

  protected constructor( id:string ) {
    this.id = id;
  }

  public abstract fetchValue(): Promise<SensorValues>;
  public abstract getValuesKeys(): Readonly<Set<string>>;
  public abstract getKeyValueUnit( key:string): Readonly<Unit>;
}


export interface SensorValues {
  values: Map<string, SensorValue>
} 

export interface SensorValue {
  timestamp: Date,
  value: ValueType
}


export class SensorCollection extends ObjectWithIdCollection<Sensor> {
}
