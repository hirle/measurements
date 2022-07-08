import { DatabaseConfig } from '../Config';
import { MeasurementSupplier } from '../Measurement';
import MeasurementsDatabase from '../MeasurementsDatabase';
import { TestingSensor } from './TestingSensor';


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