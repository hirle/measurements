import Api from '../Api';
import ServerMock from 'mock-http-server';

describe('Api', ()=>{

  // http://localhost:9000 reflected in jest.config.js
  const server = new ServerMock({ host: "localhost", port: 9000 });
  const baseUrl = 'http://localhost:9000';
  
  beforeEach(function(done) {
      server.start(done);
  });

  afterEach(function(done) {
      server.stop(done);
  });


  it('should get version', async ()=>{

    const underTest = Api.create(baseUrl);

    const payload = {
      version: '1.2.3',
      major: 1,
      minor: 2,
      patch: 3
    }

    server.on({
      method: 'GET',
      path: '/api/version',
      reply: {
          status:  200,
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload)
      }
    });

    return underTest.GetVersion()
      .then( data => {
        expect(data).toEqual(payload);
      });
  });

  it('should handle bad http status code', done =>{

    const underTest = Api.create(baseUrl);

    server.on({
      method: 'GET',
      path: '/api/version',
      reply: {
          status:  503,
          headers: { "content-type": "text/plain" },
          body: 'rainy day'
      }
    });

    underTest.GetVersion()
      .then( () => {
        fail('should not resolve')
      })
      .catch( err  => {
        expect(err).toBeInstanceOf(Error);
        expect(err.toString()).toContain('503');
        done();
      });
  });
});
