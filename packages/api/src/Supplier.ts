// Java functional interface like supplier
// see https://docs.oracle.com/javase/8/docs/api/java/util/function/Supplier.html
export default interface Supplier<T> {
    get(): T;
}