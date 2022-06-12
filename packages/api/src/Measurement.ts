import ObjectWithId, { ObjectWithIdCollection } from "./patterns/ObjectWithID";
import { Sensor, SensorValue, SensorValues } from "./sensors/Sensor";
import Supplier from "./patterns/Supplier";
import { Unit } from "./Unit";
import { ValueType } from "./ValueType";

export interface Measurement extends SensorValue {
  supplier: MeasurementSupplier
}

export class MeasurementSupplier implements Supplier<Promise<Measurement>>, ObjectWithId {
  
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
        const value: SensorValue = sensorValues.values.get(this.key);
        return {
            ...value,
            supplier: this
          };
        });
  }
}

export class MeasurementSupplierCollection extends ObjectWithIdCollection<MeasurementSupplier> {
}