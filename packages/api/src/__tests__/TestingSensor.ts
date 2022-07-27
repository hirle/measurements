import { Sensor, SensorValues } from '../sensors/Sensor';

export class TestingSensor extends Sensor {

  private values: Array<number>;
  public static onlyKey = 'foo';

  public constructor(id: string) {
    super(id);
    this.values = [];
  }

  public fetchValue(): Promise<SensorValues> {
    if (this.values.length > 0) {
      const value = {
        at: new Date(),
        value: this.values.pop()
      };
      return Promise.resolve({ values: new Map([[TestingSensor.onlyKey, value]]) });
    } else {
      return Promise.reject(new Error('no value available'));
    }
  }

  public pushValue(value: number) {
    this.values.push(value);
  }

  public getValuesKeys() {
    return new Set([TestingSensor.onlyKey]);
  }

  public getKeyValueUnit() {
    return undefined;
  }
}
