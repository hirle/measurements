import SupplierHandler from '../SupplierHandler';

describe('SupplierHandler', ()=> {
  it('should return a handler passing what got from the supplier', ()=>{
    
    const simpleSupplier =  {
      get: jest.fn().mockImplementationOnce(() => 'Hello world!')
    }
    const underTest = SupplierHandler.create(simpleSupplier);

    const response: any = {
      send: jest.fn()
    };
    underTest({} as any, response, {} as any);

    expect( simpleSupplier.get ).toBeCalledTimes(1);
    expect( response.send ).toBeCalledTimes(1);
    expect( response.send ).toHaveBeenLastCalledWith('Hello world!');
    
  });
});