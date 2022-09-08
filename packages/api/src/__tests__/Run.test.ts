import {run} from '../Run';
import Web from '../Web';
import { SensorFactory } from '../sensors/SensorFactory';
import RecorderFactory from '../recorders/RecorderFactory';
import * as MeasurementModule from '../Measurement';
import * as Log4js from 'log4js';
jest.mock('../Web');
jest.mock('../MeasurementsDatabase');
jest.mock('log4js');

describe('Run', ()=>{
  it('should log the creation of sensor, measurement supplier and recorder, should log the creation of routes ', ()=>{;

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
    expect(spyOnMeasurementSupplierConstructor).toBeCalledTimes(1);
    expect(spyOnRecorderFactory).toBeCalledTimes(1);
    
    expect(Web).toBeCalledTimes(1);  
    const mockedWeb = mockClass(Web)
    expect(mockedWeb.prototype.recordGetRoute.mock.calls).toMatchSnapshot();
    expect(mockedWeb.prototype.recordPostRoute.mock.calls).toMatchSnapshot();

  });
});

// https://instil.co/blog/typescript-testing-tips-mocking-functions-with-jest/
function mockFunction<T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> {
  return fn as jest.MockedFunction<T>;
}

function mockClass(T): jest.MockedClass<typeof T>{
  return T;
}