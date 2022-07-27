import Api from '../Api';
import 'core-js'; 
import { getLocal as mockServerGetLocal } from 'mockttp';

describe('Api', ()=>{

  // the url http://localhost:9000 reflected in jest.config.js
  const portNumber = 9000;
  const mockServer = mockServerGetLocal();
  
  // Start your mock server
  beforeEach(() => mockServer.start(portNumber));
  afterEach(() => mockServer.stop());


  it('should get version', async ()=>{

    const underTest = Api.create(mockServer.url);

    const payload = {
      version: '1.2.3',
      major: 1,
      minor: 2,
      patch: 3
    }

    mockServer.forGet('/api/version')
      .thenJson(200, payload);

    return underTest.GetVersion()
      .then( data => {
        expect(data).toEqual(payload);
      });
  });

  it('should handle bad http status code', done =>{

    const underTest = Api.create(mockServer.url);

    mockServer.forGet('/api/version')
      .thenReply(503, 'raindy day', { 'content-type': 'text/plain' });

    underTest.GetVersion()
      .then( () => {
        fail('should not resolve');
      })
      .catch( err  => {
        expect(err).toBeInstanceOf(Error);
        expect(err.toString()).toContain('503');
        done();
      });
  });
});
