import ManualRecorder from '../ManualRecorder';
import { Measurement, MeasurementSupplier } from '../../Measurement';
import { Sensor } from '../../sensors/Sensor';
import MeasurementsDatabase from '../../MeasurementsDatabase';
import {getLogger} from 'log4js';
jest.mock('log4js');

describe('ManualRecorder', ()=>{

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    (getLogger as jest.Mock).mockClear();
  });
  

  it('should get measurement, record it and log',()=>{

    const now = new Date();

    const mockSupplier: jest.Mocked<MeasurementSupplier>  = {
      id: 'test-supplier-id',
      get: jest.fn(),
      key: 'test-key',
      sensor: {} as Sensor
    }

    const measurement = new Measurement(
      mockSupplier,  
      {
        at: now,
        value: 42
      }
    );
    
    mockSupplier.get.mockImplementation(() => Promise.resolve(measurement))  

    const mockedGetLoggerInfo = jest.fn();
    (getLogger as jest.Mock).mockImplementationOnce(() => ({info: mockedGetLoggerInfo}))
    
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
        expect(mockDatabase.record).lastCalledWith(measurement);
        expect(getLogger).toBeCalledTimes(1);
        expect(getLogger).lastCalledWith('app');
        expect(mockedGetLoggerInfo).toBeCalledTimes(1);
      })

  });
});