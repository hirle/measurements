import { Sensor, SensorValues } from "./Sensor";
import Supplier from "./Supplier";
import { Unit } from "./Unit";
import { ValueType } from "./ValueType";

export interface Measurement {
  timestamp: Date,
  value: ValueType,
  unit?: Unit;
}

export class MeasurementSupplier implements Supplier<Promise<Measurement>> {
  
  public readonly id;
  public readonly sensor: Sensor;
  public readonly key: string;

  public constructor(id:string, sensor: Sensor, key: string) {
    this.id = id;
    this.sensor = sensor;
    this.key = key;
  }

  public get(): Promise<Measurement> {
    return this.sensor.fetchValue()
      .then( ( sensorValues: SensorValues )  => {
        return sensorValues.values.get(this.key);
      });
  }
}