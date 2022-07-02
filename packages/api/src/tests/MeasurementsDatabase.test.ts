import { DatabaseConfig } from '../Config';
import { MeasurementSupplier } from '../Measurement';
import MeasurementsDatabase from '../MeasurementsDatabase';
import { Sensor, SensorValues } from '../sensors/Sensor';


class TestingSensor extends Sensor {

  private values: Array<number>;
  public static onlyKey = 'foo';

  public constructor(id: string) {
    super(id);
    this.values = [];
  }

  public fetchValue(): Promise<SensorValues>{
    if( this.values.length > 0 ) {
      const value = {
        at : new Date(),
        value : this.values.pop()
      } 
      return Promise.resolve({values: new Map([[TestingSensor.onlyKey,value]])});
    } else {
      return Promise.reject(new Error());
    }
  }

  public pushValue(value: number){
    this.values.push(value);
  }

  public getValuesKeys() {
    return new Set([TestingSensor.onlyKey]);
  }

  public getKeyValueUnit() {
    return undefined;
  }
}


describe('MeasurementsDatabase', () => {

  const memorySqliteConfig: DatabaseConfig = {
    type: 'sqlite3', 
    config: {
      filename: ':memory:'
    }
  }

  it('should record measurements from one supplier', ()=>{
    const underTest = new MeasurementsDatabase(memorySqliteConfig);

    const testingSensor = new TestingSensor('single');
    testingSensor.pushValue(-10);
    testingSensor.pushValue(10);

    const measurementSupplier = new MeasurementSupplier('one', testingSensor,TestingSensor.onlyKey);

    return Promise.all([measurementSupplier.get(),measurementSupplier.get()])
      .then( measurements => {
        const [measurementOne, measurementTwo ] = measurements;
        return Promise.all([underTest.record(measurementOne), underTest.record(measurementTwo)]);
      })
      .then(() => underTest.getLatestMeasurement(measurementSupplier,2) )
      .then( measurements => {
        const [obtainedMeasurementOne, obtainedMeasurementTwo] = measurements;

        expect(obtainedMeasurementOne.getSupplier()).toBe(measurementSupplier);
        expect(obtainedMeasurementOne.getSensorValue().value).toBe(-10);
        expect(Date.now() - obtainedMeasurementOne.getSensorValue().at.getTime()).toBeLessThanOrEqual(1000);

        expect(obtainedMeasurementTwo.getSupplier()).toBe(measurementSupplier);
        expect(obtainedMeasurementTwo.getSensorValue().value).toBe(10);
        expect(Date.now() - obtainedMeasurementTwo.getSensorValue().at.getTime()).toBeLessThanOrEqual(1000);

        underTest.disconnect();
      });
  });
});