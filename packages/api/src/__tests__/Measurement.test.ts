import { MeasurementSupplier } from "../Measurement";
import { TestingSensor } from "./TestingSensor";

describe('MeasurementSupplier', ()=>{
  test('should supply value by fetching', ()=> {
    const sensor = new TestingSensor('testing');
    sensor.pushValue(42);

    const underTest = new MeasurementSupplier('under test', sensor, 'foo' );

    const startingTime = Date.now();

    return underTest.get()
    .then( measurement => {
      expect(measurement.getSupplier()).toBe(underTest);
      const value = measurement.getSensorValue();
      expect(value.value).toBe(42);
      expect(value.at.getTime()).toBeGreaterThanOrEqual(startingTime);
      expect(value.at.getTime()).toBeLessThanOrEqual(Date.now());
    })
  });
});