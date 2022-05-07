import { TCW122Sensor, TCW122SensorConfigInterface } from '../TCW122Sensor';
import { getLocal as mockServerGetLocal } from 'mockttp';
import * as path from 'path';

describe('TCW122Sensor', () => {

  const mockServer = mockServerGetLocal();
  const baseTestsData = path.join('packages', 'api', 'src', 'sensors', 'tests', 'data');

  // Start your mock server
  beforeEach(() => mockServer.start());
  afterEach(() => mockServer.stop());
  
  it('should fetchValue to obtain data', () => {

    const simpleTestConfig: TCW122SensorConfigInterface = {
      url: mockServer.url
    };

    mockServer.forGet("/status.xml")
      .thenFromFile(200, path.resolve(baseTestsData, 'status.xml'), {'Content-Type': 'text/xml'});

    const underTest = new TCW122Sensor(simpleTestConfig);
    return underTest.fetchValue()
      .then(data => {
        expect(data.ID).toBe('00:04:A3:AA:11:8E');
        expect(data.DigitalInput1).toBe(false);
        expect(data.DigitalInput2).toBe(true);
        expect(data.AnalogInput1).toBe(12.6);
        expect(data.AnalogInput2).toBe(5.0);
        expect(data.Temperature1).toBe(18.3);
        expect(data.Temperature2).toBe(12.3);
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
    
    const underTest = new TCW122Sensor(protectedTestConfig);
    return underTest.fetchValue()
      .then(data => {
        expect(data.ID).toBe('00:04:A3:AA:11:8E');
      });
  });

  it('should handle badly formatted response', () => {

    const simpleTestConfig: TCW122SensorConfigInterface = {
      url: mockServer.url
    };

    mockServer.forGet("/status.xml").thenReply(200, 'this is not XML', {'Content-Type': 'text/xml'});

    const underTest = new TCW122Sensor(simpleTestConfig);
    return expect(underTest.fetchValue()).rejects.toThrow(Error);
  });


  it('should handle communication error', () => {

    const simpleTestConfig: TCW122SensorConfigInterface = {
      url: 'http://foo.bar.org'
    }

    const underTest = new TCW122Sensor(simpleTestConfig);
    return expect(underTest.fetchValue()).rejects.toThrow(Error);
  });

  it('should handle remote server error', () => {

    const simpleTestConfig: TCW122SensorConfigInterface = {
      url: mockServer.url
    }

    mockServer.forGet("/status.xml").thenReply(501, 'rainy day', {'Content-Type': 'text/plain'});

    const underTest = new TCW122Sensor(simpleTestConfig);
    return expect(underTest.fetchValue()).rejects.toThrow(Error);
  });
});