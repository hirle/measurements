import { Measurement } from "./Measurement";


export abstract class Sensor {
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
