import {run} from '../Run';
import Web from '../Web';
import { SensorFactory } from '../sensors/SensorFactory';
import RecorderFactory from '../recorders/RecorderFactory';
import * as MeasurementModule from '../Measurement';
import * as Log4js from 'log4js';
import { LogsConfig } from '../Config';
jest.mock('../Web');
jest.mock('../MeasurementsDatabase');
jest.mock('log4js');

describe('Run', ()=>{
  it('should run with default ', ()=>{;

    const mockedLog4jsconfiguration = mockFunction(Log4js.configure);
    const mockedloggerInfo = jest.fn<void,[string]>();
    const mockedLog4jsgetLogger = mockFunction(Log4js.getLogger)
      .mockImplementation( () => ({info: mockedloggerInfo} as unknown as Log4js.Logger));

    const spyOnSensorFactory = jest.spyOn(SensorFactory, 'create');
    const spyOnMeasurementSupplierConstructor = jest.spyOn(MeasurementModule.MeasurementSupplier, 'create' );
    const spyOnRecorderFactory = jest.spyOn(RecorderFactory, 'create');

    // run with default
    run(['node', 'index.js']);
    
    expect(mockedLog4jsconfiguration.mock.calls).toMatchSnapshot();
    expect(mockedLog4jsgetLogger.mock.calls).toMatchSnapshot();
    expect(mockedloggerInfo.mock.calls).toMatchSnapshot();

    expect(spyOnSensorFactory).toBeCalledTimes(1);
    expect(spyOnRecorderFactory).toBeCalledTimes(1);
    expect(spyOnMeasurementSupplierConstructor).toBeCalled();
    expect(Web).toBeCalledTimes(1);
  });
});

// https://instil.co/blog/typescript-testing-tips-mocking-functions-with-jest/
function mockFunction<T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> {
  return fn as jest.MockedFunction<T>;
}