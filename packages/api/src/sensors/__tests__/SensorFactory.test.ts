import { SensorConfig } from "../../Config";
import { TCW122Sensor } from "../TCW122Sensor";
import { SensorFactory } from "../SensorFactory";

describe('SensorFactory', ()=>{

  it('should create a TCW122', ()=>{
    const testConfig: SensorConfig = {
      id: 'brand-new-sensor',
      type: 'tcw122',
      config: {
        url: 'https://testing.day.com'
      }
    }

    const brandNewSensor = SensorFactory.create(testConfig)
    expect(brandNewSensor).toBeInstanceOf(TCW122Sensor);
    expect(brandNewSensor.id).toBe('brand-new-sensor');
  });

  it('should throw on unknown type of sensor', ()=>{

    const badConfig: SensorConfig = {
      id: 'must-fail',
      type: 'not of this world',
      config: {
        empty: true
      }
    }

    expect( ()=> SensorFactory.create(badConfig)).toThrowError('Unknown sensor type');
  });

});