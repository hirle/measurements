import ManualRecorder from '../ManualRecorder';
import { Measurement, MeasurementSupplier } from '../../Measurement';
import { Sensor, SensorValue } from '../../sensors/Sensor';
import MeasurementsDatabase from '../../MeasurementsDatabase';

describe('ManualRecorder', ()=>{
  it('should get measurement, record it and log',()=>{

    const now = new Date();

    const mockSensor = {} as unknown as Sensor;

    const mockSupplier: jest.Mocked<MeasurementSupplier>  = {
      id: 'test-supplier-id',
      get: jest.fn(),
      key: 'test-key',
      sensor: mockSensor
    }

    const measurement = new Measurement(
      mockSupplier,  
      {
        at: now,
        value: 42
      }
    );

    mockSupplier.get.mockImplementation(() => Promise.resolve(measurement))  

    const mockDatabase: jest.Mocked<MeasurementsDatabase> = {
      record: jest.fn().mockReturnValueOnce(Promise.resolve())
    } as any;

    const underTest = new ManualRecorder(
      'test-record-id',
      mockSupplier,
      mockDatabase);
    
    return underTest.recordOneMeasurement()
      .then( () => {
        expect(mockSupplier.get).toBeCalledTimes(1);
        expect(mockDatabase.record).toBeCalledTimes(1)
        expect(mockDatabase.record).lastCalledWith(measurement)
      })

  });
});