import ObjectWithId, { ObjectWithIdCollection } from "./patterns/ObjectWithID";
import { Sensor, SensorValue, SensorValues } from "./sensors/Sensor";
import Supplier from "./patterns/Supplier";

export class Measurement {

  public constructor( 
    private supplier: MeasurementSupplier,
    private sensorValue: SensorValue
  ){}

  public getSensorValue(): SensorValue {
    return this.sensorValue;
  } 

  public getSupplier(): MeasurementSupplier {
    return this.supplier;
  } 
}

export class MeasurementSupplier implements Supplier<Promise<Measurement>>, ObjectWithId {
  
  public readonly id: string;
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
        return new Measurement(this, value);
        });
  }
}

export type MeasurementSupplierCollection = ObjectWithIdCollection<MeasurementSupplier>;