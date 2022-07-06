import { narrowSensorValue } from "../Sensor";

describe('Sensor', ()=> {
  describe('narrowSensorValue', ()=> {
    it('should throw on unexpected data', ()=>{
      expect( () => narrowSensorValue('not a SensorValue')).toThrow('unexpected data');
      expect( () => narrowSensorValue(null)).toThrow('unexpected data');
      expect( () => narrowSensorValue({at:'is defined'})).toThrow('unexpected data');
      expect( () => narrowSensorValue({at:false, value: true})).toThrow('unexpected data');
    });

    it('should validate SensorValue', () => {
      const now = new Date();
      expect(narrowSensorValue({at:now, value: true})).toEqual({at: now, value:true});
      expect(narrowSensorValue({at:now.toISOString(), value: true})).toEqual({at: now, value:true});
      expect(narrowSensorValue({at:now.getTime(), value: true})).toEqual({at: now, value:true});
    });
  });
});