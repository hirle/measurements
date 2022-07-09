import { isValueType } from "../ValueType";

describe('ValueType', ()=> {
  it('should guard the ValueType', ()=>{

    expect(isValueType(666)).toBeTruthy();
    expect(isValueType(true)).toBeTruthy();
    expect(isValueType(false)).toBeTruthy();
    expect(isValueType('happy day')).toBeTruthy();

    expect(isValueType(new Object())).toBeFalsy();
    expect(isValueType(undefined)).toBeFalsy();
    expect(isValueType(null)).toBeFalsy();
    expect(isValueType([])).toBeFalsy();
    expect(isValueType(() => null)).toBeFalsy();
  });
});