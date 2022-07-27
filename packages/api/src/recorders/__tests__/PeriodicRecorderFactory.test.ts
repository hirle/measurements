import PeriodicRecorder from '../PeriodicRecorder';
import PeriodicRecorderFactory from '../PeriodicRecorderFactory';

describe('PeriodicRecorderFactory', ()=>{
  
  it('should handle bad periodic config', () => {

    const mockedMeasurementSupplier:any = {};
    const mockedMeasurementDatabase:any = {};

    [
      null,
      {},
      {period:null},
      {period:42}
    ].forEach( testConfig => {
      expect( ()=> PeriodicRecorderFactory.create(
        'test',
        mockedMeasurementSupplier,
        mockedMeasurementDatabase,
        testConfig
      )).toThrowError('a periodic recorder requires a period as a string');
    });
  });

  it('should handle bad auto-start config', () => {
    const mockedMeasurementSupplier:any = {};
    const mockedMeasurementDatabase:any = {};

    expect( ()=> PeriodicRecorderFactory.create(
      'test',
      mockedMeasurementSupplier,
      mockedMeasurementDatabase,
      {period:'P1M', 'auto-start': 42 }
    )).toThrowError('expecting auto-start to be a boolean');
  });

  it('should create a periodc recorder', () => {
    const mockedMeasurementSupplier:any = {};
    const mockedMeasurementDatabase:any = {};

    [{period:'P1M'}, {period:'P1M', 'auto-start': false }]
    .forEach( configWOAutostart => {
      const underTest = PeriodicRecorderFactory.create(
        'test',
        mockedMeasurementSupplier,
        mockedMeasurementDatabase,
        configWOAutostart);
      expect(underTest).toBeInstanceOf(PeriodicRecorder);
      expect(underTest.id ).toBe('test');
      expect(underTest.database ).toBe(mockedMeasurementDatabase);
      expect(underTest.measurementSupplier ).toBe(mockedMeasurementSupplier);
    });
  });
});