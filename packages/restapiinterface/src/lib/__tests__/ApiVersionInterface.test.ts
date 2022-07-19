import {isApiVersionInterface, narrowApiVersionInterface} from '../ApiVersionInterface';

describe('isApiVersionInterface', () => {
    it('should decide whether it is ApiVersionInterface', () => {
      expect(isApiVersionInterface(undefined)).toBe(false);
      expect(isApiVersionInterface(null)).toBe(false);
      expect(isApiVersionInterface({})).toBe(false);
      expect(isApiVersionInterface({version: null})).toBe(false);
      expect(isApiVersionInterface({version: '1'})).toBe(false);
      expect(isApiVersionInterface({version: '1', major:null})).toBe(false);
      expect(isApiVersionInterface({version: '1', major:1})).toBe(false);
      expect(isApiVersionInterface({version: '1', major:1,minor:false})).toBe(false);
      expect(isApiVersionInterface({version: '1', major:1,minor:1})).toBe(false);
      expect(isApiVersionInterface({version: '1', major:1,minor:1,patch:false})).toBe(false);

      expect(isApiVersionInterface({version: '1', major:1,minor:1,patch:1})).toBe(true);
      expect(isApiVersionInterface({version: '1', major:1,minor:1,patch:1,opt:'beta'})).toBe(true);
    });
});

describe('narrowApiVersionInterface', () => {
  it('should throw on bad input', () => {
    expect( ( ) => narrowApiVersionInterface({})).toThrowError('unexpected data');

    expect(narrowApiVersionInterface({version: '1', major:1,minor:2,patch:3})).toStrictEqual({version: '1', major:1,minor:2,patch:3});
  });
});