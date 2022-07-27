import ObjectWithId, { ObjectWithIdCollection } from "../ObjectWithIdCollection";

describe('ObjectWithIdCollection', () => {
  
  class TestingClassWithID implements ObjectWithId {

    constructor(readonly id: string, readonly data: number){}

  }

  it('should accumulate the object and allow to find them', () =>{
    
    const one = new TestingClassWithID('foo', 1);
    const two = new TestingClassWithID('bar', 2);
    const three = new TestingClassWithID('qux', 3);

    const underTest = new ObjectWithIdCollection<TestingClassWithID>([one, two]);
    expect(underTest.findById('foo')).toBe(one);
    expect(underTest.findById('bar')).toBe(two);
    expect( () => underTest.findById('qux')).toThrowError();

    underTest.add(three);
    expect(underTest.findById('qux')).toBe(three);

    const spy = jest.fn();
    underTest.forEach(spy);
    expect(spy).toBeCalledTimes(3);
    expect(spy).toBeCalledWith(one);
    expect(spy).toBeCalledWith(two);
    expect(spy).toBeCalledWith(three);
  });
});