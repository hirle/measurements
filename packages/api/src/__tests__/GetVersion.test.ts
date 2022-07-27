import GetVersion from '../GetVersion';

describe('GetVersion', () => {

  it('should handle version', () => {
    const underTest = new GetVersion('1.0.0');
    expect( underTest.get()).toEqual({
      version: '1.0.0',
      major: 1,
      minor: 0,
      patch: 0
    });
  });

  it('should throw on invalid version', () => {
    const underTest = new GetVersion('not valid');
    expect( () => underTest.get()).toThrow('Illegal state: can read version');
  });


});
