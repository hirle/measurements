import { ValueType } from "./ValueType";
import { Unit } from "./Unit";
import Supplier from "./Supplier";


export interface SensorInterface {
  fetchValue(): Promise<SensorValues>;
  getValuesKeys(): Readonly<string[]>;
}


export interface SensorValues {
  values: Map<string, Measurement>
} 

export interface Measurement {
  timestamp: Date,
  value: ValueType,
  unit?: Unit;
}

export class MeasurementStream implements Supplier<Measurement> {
  sensor: SensorInterface;
  key: string;
  constructor(sensor: SensorInterface, key: string) {
    this.sensor = sensor;
    this.key = key;
  }
  get(): Measurement {
    throw new Error("Method not implemented.");
  }
}