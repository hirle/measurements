import { TCW122Sensor, TCW122SensorConfigInterface } from '../TCW122Sensor';
import { getLocal as mockServerGetLocal } from 'mockttp';
import * as path from 'path';
import { ValueType } from '../../ValueType';
import { Unit } from '../../Unit';

describe('TCW122Sensor', () => {

  const mockServer = mockServerGetLocal();
  const baseTestsData = path.join('packages', 'api', 'src', 'sensors', '__tests__', 'data');

  // Start your mock server
  beforeEach(() => mockServer.start());
  afterEach(() => mockServer.stop());
  
  it('should fetchValue to obtain data', () => {

    const simpleTestConfig: TCW122SensorConfigInterface = {
      url: mockServer.url
    };

    mockServer.forGet("/status.xml")
      .thenFromFile(200, path.resolve(baseTestsData, 'status.xml'), {'Content-Type': 'text/xml'});

    const underTest = TCW122Sensor.create('foo', simpleTestConfig);
    return underTest.fetchValue()
      .then(data => {

        const expectations: Map<string, [ValueType, Unit ]> = new Map([
          [ 'ID', ['00:04:A3:AA:11:8E', undefined ]],
          [ 'DigitalInput1', [false, undefined ]],
          [ 'DigitalInput2', [true, undefined ]],
          [ 'AnalogInput1', [12.6, 'V' ]],
          [ 'AnalogInput2', [5.0, 'V' ]],
          [ 'Temperature1', [18.3, '°C' ]],
          [ 'Temperature2', [12.3, '°C' ]],
        ]);
        for( const [key, expected] of expectations ) {
          const expectedValue: ValueType = expected[0];
          const expectedType: Unit = expected[1];
          const value = data.values.get(key);

          expect(Date.now() - value.at.getTime()).toBeLessThanOrEqual(10000);
          expect(value.value).toBe(expectedValue);
          
          expect(underTest.getKeyValueUnit(key)).toBe(expectedType);
        }
      });
  });

  it('should fetchValue to obtain data protected by password', () => {
    const protectedTestConfig: TCW122SensorConfigInterface = {
      url: mockServer.url,
      username: 'foo',
      password: 'bar'
    };

    mockServer.forGet("/status.xml")
      .withQuery({a: 'foo:bar'})
      .thenFromFile(200, path.resolve(baseTestsData, 'status.xml'), {'Content-Type': 'text/xml'});
    
    const underTest = TCW122Sensor.create('foo', protectedTestConfig);
    return underTest.fetchValue()
      .then(data => {
        const dataID = data.values.get('ID');
        expect(dataID.value).toBe('00:04:A3:AA:11:8E');
      });
  });

  it('should handle badly formatted response', () => {

    const simpleTestConfig: TCW122SensorConfigInterface = {
      url: mockServer.url
    };

    mockServer.forGet("/status.xml").thenReply(200, 'this is not XML', {'Content-Type': 'text/xml'});

    const underTest = TCW122Sensor.create('bad.formatting', simpleTestConfig);
    return expect(underTest.fetchValue()).rejects.toThrow(Error);
  });


  it('should handle communication error', () => {

    const simpleTestConfig: TCW122SensorConfigInterface = {
      url: 'http://foo.bar.org'
    }

    const underTest = TCW122Sensor.create('comm.error', simpleTestConfig);
    return expect(underTest.fetchValue()).rejects.toThrow(Error);
  });

  it('should handle remote server error', () => {

    const simpleTestConfig: TCW122SensorConfigInterface = {
      url: mockServer.url
    }

    mockServer.forGet("/status.xml").thenReply(501, 'rainy day', {'Content-Type': 'text/plain'});

    const underTest = TCW122Sensor.create('foo', simpleTestConfig);
    return expect(underTest.fetchValue()).rejects.toThrow(Error);
  });

  it('should handle empty config', () => {
    const emptyConfig = {};
    expect( () => TCW122Sensor.create('empty.config', emptyConfig) ).toThrow();
  });
  it('should handle null config', () => {
    const emptyConfig = null;
    expect( () => TCW122Sensor.create('null.config', emptyConfig) ).toThrow();
  });
  it('should handle bad config', () => {
    const emptyConfig = {url: 42};
    expect( () => TCW122Sensor.create('bad.config', emptyConfig) ).toThrow();
  });

});