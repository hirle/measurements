import RunnableHandler, { Runnable } from '../RunnableHandler';

describe('RunnableHandler', ()=> {
  it('should return a Handler processing runnable', ()=>{
    
    const aRunnable: Runnable = jest.fn();
    const underTest = RunnableHandler.create(aRunnable);

    const response: any = {
      send: jest.fn()
    };
    underTest({} as any, response, {} as any);

    expect( aRunnable ).toBeCalledTimes(1);
    expect( response.send ).toBeCalledTimes(1);
  });
});