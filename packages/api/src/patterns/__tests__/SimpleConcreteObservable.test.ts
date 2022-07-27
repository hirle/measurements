import { SimpleConcreteObservable, IObserver } from '../Observable';

class SpyObserver implements IObserver<number>{

  readonly spy: jest.Mock<number>;

  constructor(){
    this.spy = jest.fn();
  }

  notify( event: number){
    this.spy(event);
  }
}

describe('SimpleConcreteObservable', ()=>{
  it('should notify the observers', ()=>{
    const underTest = new SimpleConcreteObservable<number>();

    const observer1 = new SpyObserver();
    const observer2 = new SpyObserver();

    underTest.subscribe(observer1);
    underTest.subscribe(observer2);

    underTest.notify(42);

    expect(observer1.spy).toHaveBeenCalledWith(42);
    expect(observer2.spy).toHaveBeenCalledWith(42);
  });

  it('should manage the observers', ()=>{
    const underTest = new SimpleConcreteObservable<number>();

    const observer1 = new SpyObserver();
    const observer2 = new SpyObserver();

    underTest.subscribe(observer1);
    underTest.subscribe(observer2);

    underTest.notify(42);

    expect(observer1.spy).toHaveBeenCalledWith(42);
    expect(observer2.spy).toHaveBeenCalledWith(42);

    underTest.unsubscribe(observer2);
    underTest.notify(666);

    expect(observer1.spy).toHaveBeenCalledWith(666);
    expect(observer2.spy).not.toHaveBeenCalledWith(666);
  });
});