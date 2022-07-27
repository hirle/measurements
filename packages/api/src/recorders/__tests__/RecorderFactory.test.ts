import ManualRecorder from '../ManualRecorder';
import PeriodicRecorder from '../PeriodicRecorder';
import RecorderFactory from '../RecorderFactory';

describe('RecorderFactory', ()=>{
  it('should create a manual recorder', ()=>{
    const manualConfig = {
      id:'recorder-test',
      mode: 'manual'
    };

    const mockedMeasurementSupplier: any ={};
    const mockedMeasurementsDatabase: any ={};
    const mustBeManualRecorder = RecorderFactory.create(
      manualConfig,
      mockedMeasurementSupplier,
      mockedMeasurementsDatabase
    );
    
    expect(mustBeManualRecorder).toBeInstanceOf(ManualRecorder);
    expect(mustBeManualRecorder.id).toBe('recorder-test');
    expect(mustBeManualRecorder.measurementSupplier).toBe(mockedMeasurementSupplier);
    expect(mustBeManualRecorder.database).toBe(mockedMeasurementsDatabase);
  });

  it('should create a periodic recorder', ()=>{
    const periodicConfig = {
      id:'recorder-test',
      mode: 'periodic',
      config: {'period': 'PT30S'}
    };

    const mockedMeasurementSupplier: any ={};
    const mockedMeasurementsDatabase: any ={};
    const mustBeManualRecorder = RecorderFactory.create(
      periodicConfig,
      mockedMeasurementSupplier,
      mockedMeasurementsDatabase
    );
    
    expect(mustBeManualRecorder).toBeInstanceOf(PeriodicRecorder);
    expect(mustBeManualRecorder.id).toBe('recorder-test');
    expect(mustBeManualRecorder.measurementSupplier).toBe(mockedMeasurementSupplier);
    expect(mustBeManualRecorder.database).toBe(mockedMeasurementsDatabase);
  });

  it('should throw on an unknown type of recorder', ()=>{
    const fantasyConfig = {
      id:'recorder-test',
      mode: 'fantasy'
    };

    const mockedMeasurementSupplier: any ={};
    const mockedMeasurementsDatabase: any ={};
    expect( () => RecorderFactory.create(
        fantasyConfig,
        mockedMeasurementSupplier,
        mockedMeasurementsDatabase
      )).toThrowError('unknown recorder mode fantasy');

  });
});