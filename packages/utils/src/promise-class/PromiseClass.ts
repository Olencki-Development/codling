/**
 * Exposes internal promise methods on the class that resolves a result of type T
 */
export abstract class PromiseClass<T> implements Promise<T> {
  /**
   * Result to be returned when builder is resolved
   */
  protected abstract _fetchResult(): Promise<T>;

  /**
   * Exposes traditional promise methods to the class
   */

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2> {
    const result = this._fetchResult();
    return result.then.apply(result, [onfulfilled, onrejected]) as any;
  }

  catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): Promise<T | TResult> {
    return this.then().catch(onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return this.then().finally(onfinally);
  }

  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
