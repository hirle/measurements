import PeriodicRecorder from "../PeriodicRecorder";
import { Measurement, MeasurementSupplier } from '../../Measurement';
import MeasurementsDatabase from '../../MeasurementsDatabase';
import { narrowSensorValue, Sensor } from "../../sensors/Sensor";
jest.mock('../Web');
jest.mock('../MeasurementsDatabase');
jest.mock('../Measurement');
import {getLogger} from 'log4js';
jest.mock('log4js');


describe('PeriodicRecorder', ()=>{

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    (getLogger as jest.Mock).mockClear();
  });

  it('should start and stop the recording', ()=>{

    const mockedGetLoggerInfo = jest.fn();
    const mockedGetLoggerTrace = jest.fn();
    const mockedGetLoggerError = jest.fn();
    (getLogger as jest.Mock).mockImplementationOnce(() => (
      {
        info: mockedGetLoggerInfo,
        trace: mockedGetLoggerTrace,
        error: mockedGetLoggerError
      }))
  
    const measurementSupplier: jest.Mocked<MeasurementSupplier> = {
      id: 'test-supplier-id',
      get: jest.fn(),
      key: 'test-key',
      sensor: {} as Sensor
    } 

    measurementSupplier.get.mockResolvedValue(
      new Measurement(measurementSupplier, narrowSensorValue( {at: new Date(), value:42} )),
    )

    const mockDatabase: jest.Mocked<MeasurementsDatabase> = {
      record: jest.fn().mockResolvedValue(null)
    } as any;
  
    const underTest = new PeriodicRecorder('under-test',
      measurementSupplier,
      mockDatabase,
      'PT1M' );
  
    expect(underTest.isRecording()).toBeFalsy();
  
    underTest.start();
  
    expect(underTest.isRecording()).toBeTruthy();
    expect(mockedGetLoggerInfo).toHaveBeenLastCalledWith('under-test started cycling');
    expect(mockedGetLoggerTrace).toHaveBeenLastCalledWith('under-test cycles');

    underTest.stop();
    expect(underTest.isRecording()).toBeFalsy();
    expect(mockedGetLoggerInfo).toHaveBeenLastCalledWith('under-test stopped cycling');

  
  });
});


